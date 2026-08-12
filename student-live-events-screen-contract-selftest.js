const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('live-events.js','utf8');
assert.ok(src.includes("const game=document.querySelector('#game-screen')"),'live events must track the student game screen');
assert.ok(src.includes("game.classList.contains('active')"),'live event polling must require the active student game when available');
assert.ok(src.includes("if(game){const observer=new MutationObserver"),'live events must react when the game opens or closes');
assert.ok(src.includes("resumeFromLatest();else stop()"),'leaving the game must stop polling and returning must resume from the latest broadcast');
console.log('student live events screen contract self-test passed');
