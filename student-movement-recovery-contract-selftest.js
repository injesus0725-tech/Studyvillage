const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('game.js','utf8');

assert.ok(!src.includes("const movementKeys=new Set"),'legacy keyboard movement key map must stay removed from game.js');
assert.ok(!src.includes("function movementKey("),'legacy keyboard/mobile movement normalization must stay removed');
assert.ok(!src.includes(".mobile-controls button[data-key]"),'legacy mobile direction handlers must stay removed');
assert.ok(!src.includes("talkButton"),'removed talk button must never be dereferenced by the core runtime');
assert.ok(src.includes("npc.addEventListener('click'"),'NPC interaction must use normal click/tap input');
assert.ok(src.includes('도우미 선생님을 터치해 이야기하기'),'interaction guidance must describe direct touch instead of keyboard input');
assert.ok(src.includes('function movementLayer(){return player.offsetParent||world}'),'movement collision must use the player logical map layer');
assert.ok(src.includes('width=layer.clientWidth||layer.offsetWidth'),'collision percentages must be calculated against the expanded map, not the phone viewport');
assert.ok(src.includes('left:el.offsetLeft,right:el.offsetLeft+el.offsetWidth'),'obstacles must use stable map-local coordinates independent of camera translation');
assert.ok(!src.includes('const w=world.getBoundingClientRect();return[...world.querySelectorAll'), 'collision geometry must not mix the viewport with the translated map');
assert.ok(src.includes("document.addEventListener('visibilitychange',()=>{if(document.hidden)clearMovementKeys()})"),'backgrounding the browser must clear any transient movement state');
assert.ok(src.includes('function updatePlayer(){player.style.left=`${state.x}%`;player.style.top=`${state.y}%`}'),'core frame loop must only render canonical movement state');
assert.ok(src.includes("finally{requestAnimationFrame(gameLoop)}"),'a transient frame error must not permanently stop the student world loop');
assert.ok(src.includes("source:'student-world-loop'"),'world loop failures must remain diagnosable');
console.log('student movement recovery contract selftest passed');
