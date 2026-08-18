# StudyVillage stabilization audit — 2026-08-18

## Protected baseline
- Main baseline when audit started: v0.9.41 / commit `86374fac36ba2e8030e54821d449c2edeabbab40`.
- Audit work is isolated on branch `stabilization-audit-20260818` until changes are verified.
- Do not add new gameplay features during the audit.

## Confirmed scope
The expedition/reward baseline (`467ddaf4d1002a9731cedb6a24d3670a8028dc51`) to v0.9.41 spans 166 commits. The changes touch movement/input, camera, buildings, expedition flow, attempt policies, XP/reward economy, sessions, shop/avatar, and teacher controls. This is large enough that point fixes should stop until the runtime paths are simplified.

## Key findings retained from phases 1–3
- Mobile input was duplicated: `onboarding.js` captured pointer/touch and proxied movement through synthetic keyboard/d-pad events while `game.js` owned keyboard movement.
- `onboarding.js` mixed guide UI, hit testing, touch routing, movement timers, and transient UI reset.
- School, Bookmaru, and challenge hall currently collapse into the same expedition action.
- Expedition attempt routes exist, but errors are hidden behind a generic server message.
- Current expedition maps are not truly traversable; the player sprite is static and NPC click advances play.
- Early leveling is intentionally very fast under the current reward curve and must be rebalanced after baseline stability.
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
- WASD / arrow keys are no longer an official movement path;
- on-screen direction pad stays hidden;
- buildings, NPCs, HUD buttons, and panels use normal browser click/tap behavior rather than global touch interception.

### Implemented on audit branch
- `onboarding.js` is now guide-only and no longer creates synthetic keyboard or d-pad movement.
- new `student-direct-movement.js` owns map movement and directly updates the canonical player state through the existing collision-aware `tryMove` path.
- legacy movement-key listeners are blocked in capture phase while the student game is active, preventing old keyboard movement from competing with direct pointer movement.
- map movement excludes buttons, buildings, NPCs, and modal panels so clicks are not stolen from UI controls.
- `building-interiors.js` now uses a single normal `click` handler for both touch and mouse; duplicate `click + pointerup`, keyboard entry, and old talk-button entry paths were removed.
- opening a building or modal stops current map movement.
- contract tests guard the direct movement and direct building-input architecture in CI.

## Stabilization sequence from here
1. Keep `main` frozen at v0.9.41.
2. Complete student baseline flow checks: login -> village -> direct movement -> building/menu -> close/back.
3. Fix expedition attempt-policy visibility and remaining-attempt error reporting.
4. Remove remaining legacy keyboard/d-pad implementation from `game.js` only after the direct movement path is proven stable in-browser.
5. Implement true expedition traversal only after baseline stability.
6. Split building roles, rebalance XP/stars, and clean avatar assets.
7. Re-run complete teacher-mode regression before promoting the audit branch.

## Backlog after baseline stabilization
1. Restore actual expedition traversal and stage progression.
2. Reconcile expedition attempt IDs with teacher controls and show remaining attempts clearly.
3. Split school / Bookmaru / challenge hall / expedition roles.
4. Rebalance XP and levels; current ~3 completed activities -> Lv.4 is too fast in practice.
5. Rebalance stars vs XP so exploration is not the dominant XP farming path.
6. Remove astronaut base character.
7. Fit hats/glasses/bags/pets with slot-specific scale and position.
8. Later: subdivide student-visible rankings (growth, challenge, Bookmaru, weekly, cumulative stars); exploration should emphasize collection/achievements.

## Audit rule
- keep `main` unchanged until a candidate fix is verified;
- make changes on `stabilization-audit-20260818`;
- one runtime layer at a time;
- run repository verification before moving a verified candidate to main;
- if a change produces a red X/build failure, revert it on the audit branch rather than stacking another fix.
