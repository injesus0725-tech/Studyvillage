const fs=require('fs'),assert=require('assert');
const game=fs.readFileSync('game.js','utf8');
const buildings=fs.readFileSync('building-interiors.js','utf8');
const css=fs.readFileSync('building-interiors.css','utf8');

assert.ok(game.includes("const $=s=>document.querySelector(s)")&&game.includes("interactionHint=$('#interaction-hint')"),'NPC and quiz guidance must retain the base hint');
assert.ok(buildings.includes("hint.id='building-interaction-hint'"),'building proximity must use an independent hint element');
assert.ok(buildings.includes("hint.className='interaction-hint'"),'the building hint must share the existing visible style');
assert.ok(buildings.includes("hint.setAttribute('role','status')")&&buildings.includes("hint.setAttribute('aria-live','polite')"),'building entrance guidance must remain accessible');
assert.ok(!buildings.includes("hint=document.querySelector('#interaction-hint')"),'building guidance must not compete with the base movement loop for one element');
assert.ok(buildings.includes("document.body.classList.add('near-building-interaction')")&&buildings.includes("document.body.classList.remove('near-building-interaction')"),'building proximity must own and then release the visible guidance lane');
assert.ok(css.includes('.near-building-interaction #interaction-hint{opacity:0}'),'base guidance must not overlap a building entrance hint');
console.log('student interaction hint isolation contract self-test passed');
