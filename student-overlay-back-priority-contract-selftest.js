const fs=require('fs'),assert=require('assert');
const files=['customize.js','village-layout.js','daily-missions.js','exploration-collection.js','random-exploration-events.js','onboarding.js'];
for(const file of files){const src=fs.readFileSync(file,'utf8');assert.ok(src.includes("event.key==='Escape'")||src.includes("e.key==='Escape'"),`${file} must consume app back for its visible overlay`);assert.ok(src.includes('stopImmediatePropagation()'),`${file} must stop one back action from closing a background layer too`)}
const onboarding=fs.readFileSync('onboarding.js','utf8');
assert.ok(onboarding.includes("if(!choice.hidden){if(blockedKeys.has(e.key)||e.key==='Escape'"),'mandatory first-character choice must stay open on back');
console.log('student overlay back priority contract self-test passed');
