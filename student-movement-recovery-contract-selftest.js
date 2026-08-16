const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('game.js','utf8');

assert.ok(src.includes("function movementKey(value){return typeof value==='string'?value.toLowerCase():''}"),'keyboard and mobile control values must be normalized safely');
assert.ok(src.includes("const key=movementKey(e.key);if(key)state.keys.delete(key)"),'keyup events without a key must be ignored instead of throwing');
assert.ok(!src.includes('e.key.toLowerCase()'),'raw keyboard event values must never be lowercased without validation');
assert.ok(src.includes('function movementLayer(){return player.offsetParent||world}'),'movement collision must use the player logical map layer');
assert.ok(src.includes('width=layer.clientWidth||layer.offsetWidth'),'collision percentages must be calculated against the expanded map, not the phone viewport');
assert.ok(src.includes('left:el.offsetLeft,right:el.offsetLeft+el.offsetWidth'),'obstacles must use stable map-local coordinates independent of camera translation');
assert.ok(!src.includes('const w=world.getBoundingClientRect();return[...world.querySelectorAll'), 'collision geometry must not mix the viewport with the translated map');
assert.ok(src.includes("document.addEventListener('visibilitychange',()=>{if(document.hidden)clearMovementKeys()})"),'backgrounding the mobile browser must clear stale movement input');
assert.ok(src.includes('b.setPointerCapture(e.pointerId)'),'mobile direction controls must retain their active pointer until release');
assert.ok(src.includes("b.addEventListener('lostpointercapture',()=>state.keys.delete(k))"),'lost mobile pointers must release their movement key');
assert.ok(src.includes("finally{requestAnimationFrame(gameLoop)}"),'a transient frame error must not permanently stop student movement');
assert.ok(src.includes("source:'student-movement-loop'"),'movement loop failures must remain diagnosable');
console.log('student movement recovery contract selftest passed');
