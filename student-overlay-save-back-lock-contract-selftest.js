const fs=require('fs'),assert=require('assert');
const mission=fs.readFileSync('daily-missions.js','utf8');
const collection=fs.readFileSync('exploration-collection.js','utf8');
const customize=fs.readFileSync('customize.js','utf8');

assert.ok(mission.includes("if(event.key==='Escape'&&!panel.hidden){event.preventDefault();event.stopImmediatePropagation();if(!busy)panel.hidden=true}"),'daily mission back must be consumed even while reward saving prevents close');
assert.ok(collection.includes("close.onclick=()=>{panel.hidden=true}")&&collection.includes("event.stopImmediatePropagation();panel.hidden=true"),'exploration collection must consume app back and close cleanly now that collection reward claiming is retired');
assert.ok(!collection.includes('claiming'),'retired collection milestone reward state must not remain in the discovery guide');
assert.ok(customize.includes('function closePanel(){if(save.disabled)return;'),'equipment saving must keep customization open until its write finishes');
assert.ok(customize.includes("e.stopImmediatePropagation();closePanel()"),'customization back must still be consumed while close is locked');
console.log('student overlay save back lock contract self-test passed');
