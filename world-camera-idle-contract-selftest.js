const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('world-camera.js','utf8');
assert.ok(src.includes("const game=document.querySelector('#game-screen')"),'camera must know whether the game screen is visible');
assert.ok(src.includes('function active(){return !document.hidden&&(!game||!game.hidden)}'),'camera calculations must pause while the tab or game screen is hidden');
assert.ok(src.includes('if(active()){'),'camera geometry work must be guarded by active game visibility');
assert.ok(src.includes('requestAnimationFrame(updateCamera)'),'camera must resume naturally on the animation loop');
console.log('world camera idle contract self-test passed');
