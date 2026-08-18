# StudyVillage v1 stabilization candidate — 2026-08-19

## Candidate boundary
- `main` remains the protected v0.9.41 baseline.
- Candidate branch: `stabilization-audit-20260818`.
- PR #3 stays Draft until real browser/device verification finishes.

## Automated state now covered
- student login/session restore and confirmed profile refresh
- pointer-only village movement and building click/tap ownership
- school / Bookmaru / challenge hall / expedition role separation
- expedition attempt policy, remaining attempts, direct movement, collision, discoveries, exit/lifecycle cleanup
- XP/reward rebalance and star ledger consistency
- avatar legacy astronaut migration and accessory fit guards
- teacher star/XP/title/name/password/equipment corrections
- teacher attempt-policy persistence and extra attempt grants
- backup/restore validation, migration, star reconstruction and equipment restoration
- cross-layer browser ownership and script load ordering

## Manual browser/device verification matrix
Run the same student account through each target below. Do not merge if any row shows stuck input, refresh loops, duplicate panels, missing rewards, or data drift.

### 1. PC Chrome
1. Login and enter the village.
2. Click an empty map location; character should move once toward that point.
3. Click each building directly; map movement must not steal the click.
4. Open and close school, Bookmaru, challenge hall, customize, record, and expedition hub.
5. Enter an expedition, click/tap to move, approach NPC, solve one problem, collect a discovery if offered, then exit.
6. Confirm no keyboard/d-pad UI appears and no `Space` interaction is required.
7. Refresh once and confirm login/session/profile state restores without a loop.

### 2. Whale / Naver browser
Repeat the Chrome sequence, paying special attention to map click ownership, building opening, expedition NPC interaction, and browser back behavior.

### 3. iPad / coarse pointer
1. Tap empty map locations repeatedly and confirm movement follows taps without page scrolling/zoom gestures stealing input.
2. Tap buildings and HUD buttons directly; they must open immediately without also moving the character.
3. Enter expedition and confirm touch movement stays inside walkable bounds.
4. Rotate once if practical; character must remain in-bounds and controls must remain tappable.
5. Background and return to the browser once; stale movement must not continue.

## Teacher verification
1. Change one test student's XP, title, and stars; refresh and confirm values persist.
2. Grant and subtract stars once.
3. Set an expedition attempt limit, verify student remaining count, then grant +1 extra attempt.
4. Rename the test student and confirm stars/equipment/profile follow the new name.
5. Create a backup, make a visible test change, restore the backup, and confirm XP/stars/equipment/activity state return exactly.
6. Check recent activity/audit history for the teacher actions above.

## Promotion rule
Only after the manual matrix passes: make a fresh backup of the real classroom data, keep PR #3 reviewable, and then consider promoting the candidate to `main`. If any browser fails, fix on the stabilization branch and rerun the full CI bundle before retesting.
