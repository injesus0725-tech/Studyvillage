# Studyvillage stabilization device checklist

This checklist is for the first real-device pass before merging the stabilization branch to `main`.

## Student — Chrome / Android tablet
- Login once, reload, and confirm the same student session restores without a refresh loop.
- Tap several empty map positions; the character moves by destination tap and no arrow pad appears.
- Tap 배움터, 책마루, 도전관 separately; each opens its own learning role and closes back to the village.
- Open 🧭 탐험; remaining/unlimited attempt state is visible.
- Start 수수께끼 숲; tap the map to move, tap the NPC from far away, confirm the character approaches instead of opening the question instantly.
- Answer a question, approach a spawned discovery/treasure, claim it, then continue.
- Exit an unfinished expedition and confirm movement/discovery state does not remain in the village.
- Complete an expedition and confirm XP/level/attempt count refresh once.
- Open 꾸미기; astronaut is not selectable and hat/glasses/bag/pet remain aligned on the character.
- Open 내 기록 and ranking; confirm current title/level and avatar agree with the profile.

## Student — secondary browser / tablet
Repeat login, map tap, one building, one expedition NPC approach, close/return, and customize checks. This catches browser-specific pointer routing regressions.

## Teacher — admin
- Login and refresh; no panel stays permanently on “loading”.
- Stars: add then deduct a small amount and verify the new balance.
- XP, title, name, and password: edit one test student and verify each value after refresh.
- Activity record: edit one test record and verify after refresh.
- Attempt policy: change one exploration limit, verify student remaining attempts, grant +1 to one student, verify immediately.
- Activity open/close: change state and verify student access.
- Backup: download JSON and verify the file exists.
- Restore: select a valid backup and verify preflight occurs before restore; use a disposable test dataset for the actual restore pass.

## Release gate
Do not merge to `main` until the Chrome tablet pass and teacher write-action pass both complete without a blocking issue. Keep any browser-specific issue reproducible with the exact screen/action that triggered it.
