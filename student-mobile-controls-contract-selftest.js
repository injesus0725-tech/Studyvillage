const assert=require('assert');
const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const game=fs.readFileSync('game.js','utf8');
const movement=fs.readFileSync('student-direct-movement.js','utf8');

assert.ok(html.includes('<footer class="mobile-controls" hidden aria-hidden="true"></footer>'),'legacy mobile control shell must remain inert and inaccessible while old CSS is phased out');
assert.ok(!html.includes('data-key="Arrow')&&!html.includes('talk-button'),'student markup must not expose direction or talk controls');
assert.ok(!game.includes(".mobile-controls button[data-key]"),'core runtime must not bind legacy mobile direction handlers');
assert.ok(!game.includes('setPointerCapture(e.pointerId)'),'core runtime must not capture pointers for removed direction buttons');
assert.ok(!game.includes("addEventListener('contextmenu',blockNative)"),'removed direction controls must not retain long-press interception code');
assert.ok(movement.includes("world.addEventListener('pointerup'"),'touch movement must be owned by direct world pointer input');
assert.ok(movement.includes("event.button!==undefined&&event.button!==0"),'mouse preview movement must ignore non-primary clicks');
assert.ok(movement.includes("#world{touch-action:none!important}"),'the active touch surface must suppress browser gesture takeover');
console.log('student mobile controls retirement contract selftest passed');
