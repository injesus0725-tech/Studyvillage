import assert from 'node:assert/strict';
import fs from 'node:fs';

const game=fs.readFileSync('library-game.js','utf8');
const css=fs.readFileSync('library-game.css','utf8');

assert.match(game,/function showNextButton\(\)/,'Bookmaru must expose an explicit next-button state');
assert.match(game,/next\.hidden=false/,'next button must be revealed after feedback');
assert.match(game,/next\.scrollIntoView/,'revealed next button must be brought into the visible card area');
assert.match(game,/showNextButton\(\)/,'answer flow must reveal the next button');
assert.match(game,/function returnVillage\(\)\{next\.disabled=false;panel\.hidden=true;window\.dispatchEvent\(new Event\('studyvillage:return-to-village'\)\)\}/,'Bookmaru return action must re-enable its button, close the activity, and restore the village flow');
assert.ok((game.match(/next\.disabled=false;next\.hidden=false/g)||[]).length>=2,'success and save-error result screens must both restore an enabled action button');
assert.ok(game.includes("next.textContent='마을로 돌아가기 🏡';next.onclick=returnVillage"),'completed Bookmaru must offer a direct village return button');
assert.ok(!game.includes("next.textContent='책마루로 돌아가기'"),'completed Bookmaru must not imply that it returns to another Bookmaru screen');
assert.match(css,/#library-next:not\(\[hidden\]\)\{[^}]*display:block!important[^}]*position:sticky[^}]*bottom:0/,'next button must remain visible at the bottom of the scrollable card');
assert.match(css,/@media\(max-width:700px\),\(pointer:coarse\)/,'coarse iPad input must receive the large next-button layout');

console.log('bookmaru next-button and village-return contract self-test passed');
