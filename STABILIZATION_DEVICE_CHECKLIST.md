# Studyvillage stabilization device checklist

This is the single release-gate checklist for the stabilization candidate before merging to `main`.

## Student — PC Chrome
- Login once, reload, and confirm the same student session restores without a refresh loop.
- Click several empty map positions; the character moves by destination click only.
- Click 배움터, 책마루, 도전관 separately; each opens its own learning role and closes back to the village.
- Confirm no arrow pad, WASD/arrow-key movement, `Space` interaction requirement, or talk button appears.
- Open 🧭 탐험; remaining/unlimited attempt state is visible.
- Start 수수께끼 숲; click the map to move, click the NPC from far away, confirm the character approaches instead of opening the question instantly.
- Answer a question, approach a spawned discovery/treasure, claim it, then continue.
- Exit an unfinished expedition and confirm movement/discovery state does not remain in the village.
- Complete an expedition and confirm XP/level/attempt count refresh once.
- Open 꾸미기; astronaut is not selectable and hat/glasses/bag/pet remain aligned on the character.
- Open 내 기록 and ranking; confirm current title/level and avatar agree with the profile.

## Student — Whale / Naver browser
Repeat login/reload, several map clicks, all three buildings, one expedition NPC approach, close/return, and customize checks. Pay special attention to click ownership: a building or HUD click must never be stolen by map movement.

## Student — iPad / touch
- Tap several empty map positions; movement follows the taps and no page scroll/gesture steals the input.
- Tap buildings and HUD buttons directly; they open immediately without also moving the character.
- Open 🧭 탐험 and enter one expedition; touch movement stays inside walkable bounds and obstacles are respected.
- Tap the NPC from far away and verify approach-first interaction.
- Rotate the iPad once if practical; the character remains in bounds and UI stays tappable.
- Put the browser in the background and return once; stale movement must not continue.
- Exit the expedition and confirm village controls still respond normally.

## Teacher — admin
- Login and refresh; no panel stays permanently on “loading”.
- Stars: add then deduct a small amount and verify the new balance.
- XP, title, name, and password: edit one test student and verify each value after refresh.
- Activity record: edit one test record and verify after refresh.
- Attempt policy: change one exploration limit, verify student remaining attempts, grant +1 to one student, verify immediately.
- Activity open/close: change state and verify student access.
- Rename one disposable test student and confirm stars/equipment/profile follow the new name.
- Backup: download JSON and verify the file exists.
- Restore: make one visible disposable change, restore the backup, and verify XP/stars/equipment/activity state return exactly.
- Check recent activity/audit history for the teacher actions above.

## Release gate
Do not merge to `main` until PC Chrome, Whale/Naver, iPad touch, and teacher write-action passes complete without a blocking issue. If any browser fails, fix only on `stabilization-audit-20260818`, rerun the full CI bundle, then repeat the failed device path before promotion.
