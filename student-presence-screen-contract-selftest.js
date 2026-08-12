const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('presence.js','utf8');
assert.ok(src.includes("const game=document.querySelector('#game-screen')"),'presence must track the student game screen');
assert.ok(src.includes("game.classList.contains('active')"),'presence must require an active student game when available');
assert.ok(src.includes("if(game){const observer=new MutationObserver"),'presence must react when the student game opens or closes');
assert.ok(src.includes("else stop()"),'presence heartbeat must stop after leaving the student game');
console.log('student presence screen contract self-test passed');
