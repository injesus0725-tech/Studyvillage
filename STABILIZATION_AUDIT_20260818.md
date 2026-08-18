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

### 24. Teacher attempt settings had a real persistence bug
Math and Bookmaru daily defaults were previously forced over teacher-saved policy values every time policies were read. The audit branch now keeps the daily period for those built-in activities while honoring the teacher's saved mode/limit/XP setting. The teacher attempt panel also reloads after admin login instead of remaining stuck after an early unauthenticated fetch.

## Phase 5 — teacher writes now have an end-to-end server test

### 25. Static route checks were not enough
The earlier guards only proved that matching route strings existed. They could not prove that an authenticated teacher write actually changed SQLite and could be read back.

A new isolated runtime integration test now boots the real classroom server against a temporary SQLite directory and exercises the same HTTP APIs used by the teacher UI.

It covers:
- create/login a temporary student;
- admin login;
- star read -> +5 grant -> -2 subtraction -> reread balance/ledger;
- XP correction -> reread `/api/admin/players`;
- student activity completion -> teacher activity-record correction;
- exploration attempt-policy save -> student attempt-status read;
- per-student +1 extra attempt -> student remaining-attempt reread;
- teacher change-history visibility for XP/activity corrections.

The test deletes its temporary DB after completion and is now part of the audit-branch Verify workflow. This gives us a true server-side pass/fail signal for the teacher mutations that were reported as unreliable, without touching classroom data.

### 26. Star and XP code paths themselves are structurally complete
Source inspection shows star adjustment is transactional and writes an immutable star ledger plus backup mirror. XP correction writes directly to the player row and logs a teacher correction event. The new runtime integration test is intended to distinguish a server write failure from a teacher-page lifecycle/auth/UI failure.

If the server integration passes while field UI still fails, the next target is the admin-page lifecycle and error visibility rather than rewriting the database logic.

## Phase 6 — expanded teacher runtime regression

### 27. Remaining high-value teacher mutations are now covered in the same isolated runtime test
The teacher runtime integration now also verifies:
- teacher title correction;
- activity open/close and student-visible reread;
- password reset plus old-session revocation and new-password login;
- student rename plus admin reread and renamed login;
- star balance surviving rename;
- change-history entries for title and rename;
- backup creation;
- post-backup mutation followed by restore;
- restored activity state, renamed student, XP, and star balance.

This expands the test from route existence to complete write -> reread -> session/data preservation behavior across the teacher operations most likely to affect real classroom data.

### 28. Movement architecture is now ready for the next stabilization phase
Source inspection reconfirms that `game.js` still handles keyboard and on-screen direction-pad state, while `onboarding.js` converts tablet taps into synthetic arrow-key events every 80 ms and globally captures pointer/touch end events. This is the next major simplification target after teacher runtime verification: direct target-coordinate movement for both touch and mouse, with keyboard/d-pad support removed.

## Stabilization sequence from here
1. Keep `main` frozen at v0.9.41.
2. Repair any teacher mutation that fails the expanded runtime regression.
3. Simplify student movement to one direct tap/click target path; remove keyboard/d-pad support.
4. Establish one stable student flow: login -> village -> tap/click movement -> building/menu -> close/back.
5. Fix expedition attempt-policy visibility and remaining-attempt display.
6. Implement true expedition traversal only after baseline stability.
7. Split building roles, rebalance XP/stars, and clean avatar assets.
8. Isolate Chrome compatibility work to the final direct pointer/touch input layer.
9. Run complete teacher-mode regression again before promoting the audit branch.

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
