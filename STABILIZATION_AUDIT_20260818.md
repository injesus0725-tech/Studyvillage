# StudyVillage stabilization audit — 2026-08-18

## Protected baseline
- Main baseline when audit started: v0.9.41 / commit `86374fac36ba2e8030e54821d449c2edeabbab40`.
- Audit work is isolated on branch `stabilization-audit-20260818` until changes are verified.
- Do not add new gameplay features during the audit.

## Confirmed scope
The expedition/reward baseline (`467ddaf4d1002a9731cedb6a24d3670a8028dc51`) to v0.9.41 spans 166 commits. The changes touch movement/input, camera, buildings, expedition flow, attempt policies, XP/reward economy, sessions, shop/avatar, and teacher controls. This is large enough that point fixes should stop until the runtime paths are simplified.

## Key findings retained from phases 1–3
- Mobile input is duplicated: `onboarding.js` captures pointer/touch globally and converts taps to synthetic keyboard events, while `game.js` owns keyboard/d-pad movement.
- `onboarding.js` mixes guide UI, preview UI, hit testing, touch routing, movement timers, and transient UI reset.
- `tablet-controls.css` exists but is not loaded; mobile CSS is also injected from JS.
- School, Bookmaru, and challenge hall currently collapse into the same expedition action.
- Expedition attempt routes exist, but errors are hidden behind a generic server message.
- Current expedition maps are not truly traversable; the player sprite is static and NPC click advances play.
- Early leveling is intentionally very fast under the current reward curve and must be rebalanced after baseline stability.
- Electron still loads a legacy activity-state hook in addition to canonical server activity-state routes.
- Attempt routes are installed indirectly through unrelated star/question modules, making wiring difficult to audit.

## Phase 4 — teacher mode and input decision

### 21. Official student movement is now touch/click only
The real classroom client is tablet-first. PC student play is only a teacher/development fallback.

Final stabilization target:
- tablet/phone: tap destination to move;
- PC student preview: mouse click destination to move;
- remove WASD / arrow-key movement as a supported feature;
- remove the on-screen mobile direction pad;
- village and future expedition traversal should share the same direct target-coordinate movement API.

This allows the recent synthetic keyboard fallback layers to be removed rather than repaired.

### 22. Teacher mode must be treated as a full stabilization surface
Field testing reports that, apart from item-related operations and destructive reset/delete actions, most teacher mutations have not been reliable. Star grant/subtract and other correction/settings operations must therefore be assumed broken until verified end-to-end.

Teacher write surfaces to verify individually:
- student password reset;
- XP correction;
- title correction;
- activity record correction;
- student rename;
- equipment repair;
- item grant;
- star grant/subtract;
- activity attempt-policy save;
- per-student extra attempt grant;
- activity open/close state;
- backup/restore;
- change-history undo where applicable.

### 23. Teacher client/server route names are mostly present, but presence is not proof of runtime success
Source tracing confirms the main teacher clients point at matching server routes. For example:
- `admin-stars.js` POSTs to `/api/admin/stars/{name}/adjust`;
- `server/question-review.js` installs `/api/admin/stars/:name/adjust` and calls `changeStars(...)`;
- XP/title/activity corrections in `admin-student-edit.js` match routes in `server/server.js`.

Therefore the reported failures are likely runtime/auth/data/validation/route-order problems rather than simply missing buttons or missing endpoint strings. A source-level teacher write wiring guard has been added, but each operation still needs real authenticated runtime verification.

### 24. Stabilization verification now covers route wiring for both student and teacher controls
The audit branch now runs:
- repository verification;
- classroom regression bundle;
- stabilization student/attempt route wiring guard;
- stabilization teacher write wiring guard.

These guards prevent another round of adding UI that points at absent/mismatched server routes. They do not replace live functional testing.

## Stabilization sequence from here
1. Keep `main` frozen at v0.9.41.
2. Finish route/runtime diagnostics before changing gameplay behavior.
3. Verify teacher write APIs end-to-end, starting with stars and activity-attempt controls because they are visibly failing in field use.
4. Simplify student movement to one direct tap/click target path; remove keyboard/d-pad support.
5. Establish one stable student flow: login -> village -> tap/click movement -> building/menu -> close/back.
6. Fix expedition attempt-policy visibility and remaining-attempt display.
7. Implement true expedition traversal only after baseline stability.
8. Split building roles, rebalance XP/stars, and clean avatar assets.
9. Isolate Chrome compatibility work to the final direct pointer/touch input layer.
10. Run complete teacher-mode regression again before promoting the audit branch.

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
