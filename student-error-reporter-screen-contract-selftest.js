const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('error-reporter.js','utf8');
assert.ok(src.includes("const game=document.querySelector('#game-screen')"),'error reporter must track the student game screen');
assert.ok(src.includes("game.classList.contains('active')"),'automatic error uploads must require an active student game when available');
assert.ok(src.includes("if(game){const observer=new MutationObserver"),'error reporter must react when the student game opens or closes');
assert.ok(src.includes("else stopFlush()"),'leaving the student game must stop automatic error uploads');
console.log('student error reporter screen contract self-test passed');
