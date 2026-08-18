# StudyVillage stabilization audit — 2026-08-18

## Protected baseline
- Main baseline when audit started: v0.9.41 / commit `86374fac36ba2e8030e54821d449c2edeabbab40`.
- Audit work is isolated on branch `stabilization-audit-20260818` until changes are verified.
- Do not add new gameplay features during the audit.

## Confirmed scope
The expedition/reward baseline (`467ddaf4d1002a9731cedb6a24d3670a8028dc51`) to v0.9.41 spans 166 commits. The changes touch movement/input, camera, buildings, expedition flow, attempt policies, XP/reward economy, sessions, shop/avatar, and teacher controls. This is large enough that point fixes should stop until the runtime paths are simplified.

## Phase 1 findings

### 1. Mobile input is duplicated and high risk
`onboarding.js` currently owns tablet tap-to-move and also intercepts document-level `pointerup` and `touchend` in capture phase. It then converts touch movement into synthetic keyboard events every 80 ms. This overlaps with the native keyboard movement state in `game.js`, direct building click handlers in `building-interiors.js`, and other panel/button click handlers.

Decision:
- PC: keep native WASD/arrow keyboard movement.
- Tablet/phone: one official tap-to-move path only.
- Remove mobile direction-pad UI from the final stabilized client.
- Do not synthesize keyboard events for touch in the final architecture if direct touch coordinates can drive the same movement state safely.

### 2. `onboarding.js` has too many responsibilities
It currently handles:
- guide modal
- teacher preview return link
- mobile tap routing
- tap target animation
- mobile movement timer
- HUD/building/NPC hit testing
- panel blocking detection
- login-time transient UI reset

This makes a guide script part of the critical runtime input layer. Split guide/preview behavior from touch movement during stabilization.

### 3. A tablet stylesheet exists but is not loaded
`tablet-controls.css` exists and contains dynamic viewport / mobile control layout safeguards, but `index.html` does not link it. Meanwhile `onboarding.js` injects its own mobile CSS and hides `.mobile-controls`. This is stale/duplicated mobile architecture and must be reconciled rather than layered further.

### 4. Building roles are currently collapsed into expedition
`building-interiors.js` maps school, library, and quiz hall to the same `action:'explore'`, and each shows `문제 탐험 열기`. This does not match the intended product structure.

Target roles after stabilization:
- 배움터: subject/class learning
- 책마루: daily Bookmaru / vocabulary / knowledge / riddles
- 도전관: competitive/challenge activities and records
- 탐험: separate RPG-style map adventure

### 5. Expedition runtime exists but entry/policy wiring is inconsistent
`assets/student-study-menu.js` contains an expedition hub, randomized map templates, stage progression, NPC traits, treasure/event hooks, and activity IDs such as `exploration-forest-riddle` and `exploration-mountain-riddle`.

The current user-visible symptom is that entry fails with an attempt-status/server message before the expedition can be tested. Stabilization must trace the exact request chain from expedition card -> attempt status -> server response -> stage start.

### 6. Teacher attempt-policy UI already contains exploration IDs
`admin-attempt-policy.js` already lists:
- `exploration-forest-riddle`
- `exploration-mountain-riddle`

and `admin.html` does load `admin-attempt-policy.js`.

Do not add a second attempt system; reconcile and surface the existing one.

### 7. Attempt-policy defaults are incomplete for exploration
`server/activity-attempt-settings.js` hard-codes daily policies only for:
- `math-arithmetic` = 3/day
- `library-vocabulary` = 1/day

Exploration activities have no hard-coded default and therefore normalize to unlimited / first-completion-XP until a teacher policy is explicitly stored.

### 8. Error wording currently conflates policy/status failure with server failure
`activity-gate.js` reports `교실 서버 연결이 돌아오면 다시 시도` whenever the attempt-status request is non-OK or returns `ok:false`. This can mask configuration/auth/API errors as a network error.

## Phase 2 findings

### 9. Attempt routes are wired indirectly, not missing
Initial source inspection of `server/server.js` alone made the attempt routes look absent. Full tracing corrected that conclusion:
- `server/server.js` installs `installStarLedgerRoutes(...)`.
- `server/star-ledger.js` installs `installActivityAttemptStudentRoutes(...)` with expedition reward and math validation adapters.
- `server/server.js` installs `installQuestionReviewRoutes(...)`.
- `server/question-review.js` installs attempt setting, overview, and extra-attempt admin routes.

Therefore the student attempt-status endpoint and teacher attempt-policy endpoints are intended to exist in the running server. The current expedition status failure is not explained by a missing import alone.

### 10. Exploration without a stored teacher policy should still be allowed
`normalizeAttemptPolicy({})` becomes `unlimited`, so an exploration activity with no stored policy should return `allowed:true`. Therefore the observed `탐험 참여 횟수를 확인하지 못했어요` means the fetch is failing or returning non-OK before policy evaluation succeeds. High-priority suspects are:
- authentication/session response for this request,
- route/runtime exception,
- local server/runtime mismatch,
- a 404/500 hidden by generic client wording.

Next diagnostic must expose the actual HTTP status and server error code instead of showing only the generic server message.

### 11. Current expedition map is not actually traversable
This is a major product/runtime finding. `assets/student-study-menu.js` renders each expedition stage as:
- a static `.sv-stage-player` avatar,
- decorative map elements,
- one clickable `.sv-stage-npc` button.

There is no player coordinate state, tap-to-move handler, collision/path traversal, or NPC proximity requirement inside the expedition stage. The only way to progress is to click the NPC, exactly matching the user's observation.

So "탐험은 안 되고 NPC만 클릭해서 문제를 푼다" is not merely an input bug. The current expedition implementation is a sequence of illustrated rooms, not a true 2D traversal engine. Restoring real exploration will require a deliberate implementation after baseline stabilization rather than a small bug fix.

### 12. Expedition status gate is separate from the general `activity-gate.js`
`assets/student-study-menu.js` performs its own direct call to:
`/api/player/me/activity-attempt-status/{activityId}`
inside `startExpedition()`.

If that request throws or returns non-OK, it immediately shows the generic `탐험 참여 횟수를 확인하지 못했어요` alert. This means expedition entry can fail even if the older building/quiz activity gate is otherwise healthy. The expedition gate should eventually share one status helper with the rest of the app.

### 13. Teacher attempt settings exist but are easy to miss when loading fails
The admin attempt panel is dynamically inserted by `admin-attempt-policy.js`. Its exploration entries are rendered only after `/api/admin/activity-attempt-policies` loads successfully. If that fetch fails, the panel can remain effectively empty with a small `설정 불러오기 실패` status instead of clearly explaining why exploration settings are unavailable. This matches the report that there is no obvious exploration-attempt control.

### 14. Early level growth is mathematically consistent with the current economy, but feels too fast
`server/reward-economy.js` awards roughly 280–335 XP per completed activity. The current level curve requires approximately:
- Lv.2: 200 total XP
- Lv.3: 450 total XP
- Lv.4: 750 total XP

Therefore about three completed activities naturally produce Lv.4. This is not an accidental duplicate-award conclusion yet; it follows directly from the configured curve. The semester target (90 days × ~4.5 activities/day -> Lv.70) was achieved by making early levels extremely fast. Rebalancing should preserve the semester target while slowing the first 10–20 levels.

### 15. Verification coverage has a runtime-wiring blind spot
The verify script syntax-checks attempt modules and many contract tests, but the current symptoms show that "module exists and parses" is not enough. We need a lightweight route-wiring regression test that proves, from the assembled server, that these authenticated endpoints actually respond:
- student attempt status
- admin attempt policies
- admin attempt overview

This should be added before merging stabilization changes.

## Stabilization sequence from here
1. Keep `main` frozen at v0.9.41.
2. Add diagnostics/tests on the audit branch before changing gameplay behavior.
3. Identify the actual HTTP status/code returned by expedition attempt-status calls.
4. Simplify mobile input architecture only after the current runtime wiring is understood.
5. Establish one stable student flow: login -> village -> tap movement -> building/menu -> close/back.
6. Then fix expedition attempt-policy visibility and teacher controls.
7. Only after baseline stability, implement real expedition traversal.
8. Then split building roles, rebalance XP/stars, and clean avatar assets.
9. Chrome compatibility is handled as an isolated input/browser layer after native flow is stable in the working browser.

## Backlog after baseline stabilization
1. Verify full student flow without adding new features.
2. Stabilize mobile tap-to-move and Chrome compatibility.
3. Restore actual expedition traversal and stage progression.
4. Reconcile expedition attempt IDs with teacher controls and show remaining attempts clearly.
5. Split school / Bookmaru / challenge hall / expedition roles.
6. Rebalance XP and levels; current observed ~3 problem sessions -> Lv.4 is explained by the current curve but is too fast in practice.
7. Rebalance stars vs XP so exploration is not the dominant XP farming path.
8. Remove astronaut base character.
9. Fit hats/glasses/bags/pets to the avatar by slot-specific scale and position.
10. Later: subdivide student-visible rankings (growth, challenge, Bookmaru, weekly, cumulative stars); exploration should emphasize collection/achievements.
11. Run teacher-mode end-to-end verification after student runtime is stable.

## Audit rule
For the next fixes:
- keep `main` unchanged until a candidate fix is verified;
- make changes on `stabilization-audit-20260818`;
- one runtime layer at a time;
- run repository verification before moving a verified candidate to main;
- if a change produces a red X/build failure, revert it on the audit branch rather than stacking another fix.
