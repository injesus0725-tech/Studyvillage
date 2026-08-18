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
`assets/student-study-menu.js` contains a real expedition hub, randomized map templates, stage progression, NPC traits, treasure/event hooks, and activity IDs such as `exploration-forest-riddle` and `exploration-mountain-riddle`.

The current user-visible symptom is that entry fails with an attempt-status/server message before the actual expedition can be tested. Stabilization must trace the exact request chain from expedition card -> attempt gate -> server status -> stage start.

### 6. Teacher attempt-policy UI already contains exploration IDs
`admin-attempt-policy.js` already lists:
- `exploration-forest-riddle`
- `exploration-mountain-riddle`

and `admin.html` does load `admin-attempt-policy.js`.

Therefore the report that the teacher cannot find expedition attempt settings is likely an information-architecture/rendering/discoverability issue or a mismatch between the expedition activity IDs being checked and the IDs exposed by the teacher panel. Do not add a second attempt system; reconcile the existing one.

### 7. Attempt-policy defaults are incomplete for exploration
`server/activity-attempt-settings.js` hard-codes daily policies only for:
- `math-arithmetic` = 3/day
- `library-vocabulary` = 1/day

Exploration activities have no hard-coded default there and fall back to normalized/default policy behavior unless teacher settings are stored. This is a likely contributor to confusing status behavior and must be verified against the student attempt-status endpoint.

### 8. Error wording currently conflates policy/status failure with server failure
`activity-gate.js` reports `교실 서버 연결이 돌아오면 다시 시도` whenever the attempt-status request is non-OK or returns `ok:false`. This can mask configuration/ID/API mismatches as a network error. Stabilization should distinguish:
- real network/timeout
- unauthenticated session
- unknown activity ID
- policy unavailable
- attempts exhausted

## Backlog after baseline stabilization
1. Verify full student flow without adding new features.
2. Stabilize mobile tap-to-move and Chrome compatibility.
3. Restore actual expedition traversal and stage progression.
4. Reconcile expedition attempt IDs with teacher controls and show remaining attempts clearly.
5. Split school / Bookmaru / challenge hall / expedition roles.
6. Rebalance XP and levels; current observed ~3 problem sessions -> Lv.4 is too fast.
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
