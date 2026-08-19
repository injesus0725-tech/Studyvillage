# StudyVillage stabilization audit — 2026-08-18

## Protected baseline
- Main baseline when audit started: v0.9.41 / commit `86374fac36ba2e8030e54821d449c2edeabbab40`.
- Audit work is isolated on branch `stabilization-audit-20260818` until changes are verified.
- Do not add unrelated gameplay features during the audit.

## Confirmed scope
The expedition/reward baseline (`467ddaf4d1002a9731cedb6a24d3670a8028dc51`) to v0.9.41 spans 166 commits. The changes touch movement/input, camera, buildings, expedition flow, attempt policies, XP/reward economy, sessions, shop/avatar, and teacher controls. This is large enough that point fixes should stop until the runtime paths are simplified.

## Key findings retained from phases 1–3
- Mobile input was duplicated: `onboarding.js` captured pointer/touch and proxied movement through synthetic keyboard/d-pad events while `game.js` owned keyboard movement.
- `onboarding.js` mixed guide UI, hit testing, touch routing, movement timers, and transient UI reset.
- School, Bookmaru, and challenge hall collapsed into the same expedition action.
- Expedition attempt routes exist, but errors were hidden behind generic server messages.
- Early leveling was too fast under the previous reward curve and required stabilization.
- Electron still loads a legacy activity-state hook in addition to canonical server activity-state routes.
- Attempt routes are installed indirectly through unrelated star/question modules, making wiring difficult to audit.

## Teacher-mode stabilization
- Teacher attempt settings had a real persistence bug: built-in defaults overwrote teacher-saved limits. The audit branch now preserves teacher-saved values.
- The teacher attempt panel now reloads after admin login rather than remaining stuck after an early unauthenticated request.
- An isolated runtime integration test boots the real server with a temporary SQLite DB and verifies teacher writes end-to-end.
- Runtime coverage now includes star grant/subtract, XP correction, activity-record correction, attempt policy, extra attempts, title correction, activity open/close, password reset with session revocation, rename, star preservation through rename, backup/restore, and audit-history visibility.

## Phase 6 — input simplification
### Official movement contract
- tablet/phone: tap destination to move;
- PC student preview: mouse click destination to move;
- WASD / arrow keys are not an official movement path;
- on-screen direction pad stays hidden;
- buildings, NPCs, HUD buttons, and panels use normal browser click/tap behavior rather than global touch interception.

### Implemented on audit branch
- `onboarding.js` is guide-only and no longer creates synthetic keyboard or d-pad movement.
- `student-direct-movement.js` owns map movement and directly updates the canonical player state through the existing collision-aware `tryMove` path.
- map movement excludes buttons, buildings, NPCs, and modal panels so clicks are not stolen from UI controls.
- `building-interiors.js` uses a single normal `click` handler for both touch and mouse; duplicate `click + pointerup`, keyboard entry, and old talk-button entry paths were removed.
- opening a building or modal stops current map movement.
- contract tests guard the direct movement and direct building-input architecture in CI.

## Phase 7 — attempt/gate stabilization
- `activity-gate.js` no longer intercepts keyboard or the legacy talk button. It only guards the activity that actually asks it for permission and exposes one reusable `StudyVillageActivityGate` API.
- attempt failures distinguish missing/expired student session (401), missing route (404), server policy failure (5xx), timeout/network failure, and genuine attempt exhaustion.
- isolated expedition runtime tests prove both riddle expeditions are unlimited by default and immediately reflect teacher-saved limited policies.
- the student expedition hub shows unlimited/remaining/exhausted attempt state, and teacher labels identify the matching exploration activities.

## Phase 8 — baseline flow and building separation
- a complete student baseline contract guards login -> village -> direct movement -> building/menu -> close/back -> expedition attempt visibility.
- school, Bookmaru, and challenge hall no longer share one `문제 탐험 열기` action.
- school opens the math learning practice, Bookmaru opens the daily Bookmaru challenge, and challenge hall opens its own riddle challenge.
- the top `탐험` button remains the dedicated entry point for expedition maps.
- a dedicated building-role contract prevents the three buildings from collapsing back into one expedition action.

## Phase 9 — legacy movement retirement and runtime crash removal
- obsolete keyboard/WASD/arrow movement listeners were physically removed from `game.js` instead of only being neutralized later by another script.
- obsolete mobile d-pad pointer capture, long-press suppression, and direction-button bindings were removed from the core runtime.
- the removed `#talk-button` was still dereferenced by `game.js`; this could throw during student startup even though the visible button no longer existed. The dereference is now gone.
- NPC interaction now uses a normal click/tap handler and the hint says to touch the helper directly.
- the core frame loop only renders canonical player coordinates; destination movement remains owned by `student-direct-movement.js`.
- stale regression tests that required the deleted keyboard/d-pad implementation were rewritten to protect the pointer-only architecture instead.
- the legacy empty mobile-control footer remains hidden/inert only as temporary CSS compatibility; it has no direction/talk controls and no JS handlers.
- after these removals, repository verification and the full stabilization CI bundle pass end-to-end.

## Current candidate state
- latest audit candidate has a green Verify workflow across repository verification, teacher runtime integration, pointer routing, direct building input, attempt gates, expedition movement/discovery/lifecycle, reward economy, browser ownership collision, avatar stabilization, and legacy-character migration.
- `main` remains unchanged and the stabilization PR remains Draft.
- code-side baseline is ready for real browser/device verification before promotion.

## Stabilization sequence from here
1. Keep `main` frozen at v0.9.41.
2. Browser/device verification of the audit candidate: Chrome + Whale/Naver + iPad/tablet touch.
3. During device verification, specifically exercise login, tap movement, building entry/exit, top exploration entry, attempt counts, Bookmaru, challenge hall, record/customize panels, back/close behavior, and teacher corrections.
4. If the candidate survives device verification, remove remaining inert mobile-control CSS/footer compatibility and update the visible version.
5. Only after baseline promotion, continue expedition-content expansion and broader economy tuning.

## Backlog after baseline stabilization
1. Expand true expedition traversal/stage progression only after the stable candidate is promoted.
2. Continue tuning XP/stars from real classroom usage rather than reopening the movement architecture.
3. Later: subdivide student-visible rankings (growth, challenge, Bookmaru, weekly, cumulative stars); exploration should emphasize collection/achievements.
4. Remove residual compatibility-only CSS/assets once device verification proves they are unnecessary.

## Audit rule
- keep `main` unchanged until a candidate fix is verified;
- make changes on `stabilization-audit-20260818`;
- one runtime layer at a time;
- run repository verification before moving a verified candidate to main;
- if a change produces a red X/build failure, fix or revert the exact failing layer before adding unrelated changes.
