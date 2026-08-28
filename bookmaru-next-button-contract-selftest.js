import assert from 'node:assert/strict';
import fs from 'node:fs';

const game=fs.readFileSync('library-game.js','utf8');
const css=fs.readFileSync('library-game.css','utf8');

assert.match(game,/function showNextButton\(\)/,'Bookmaru must expose an explicit next-button state');
assert.match(game,/next\.hidden=false/,'next button must be revealed after feedback');
assert.match(game,/next\.scrollIntoView/,'revealed next button must be brought into the visible card area');
assert.match(game,/showNextButton\(\)/,'answer flow must reveal the next button');
assert.match(css,/#library-next:not\(\[hidden\]\)\{[^}]*display:block!important[^}]*position:sticky[^}]*bottom:0/,'next button must remain visible at the bottom of the scrollable card');
assert.match(css,/@media\(max-width:700px\),\(pointer:coarse\)/,'coarse iPad input must receive the large next-button layout');

console.log('bookmaru next-button contract self-test passed');
