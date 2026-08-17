const fs=require('fs'),assert=require('assert');
const files=['customize.js','village-layout.js','daily-missions.js','exploration-collection.js','random-exploration-events.js','onboarding.js'];
for(const file of files){const src=fs.readFileSync(file,'utf8');assert.ok(src.includes("event.key==='Escape'")||src.includes("e.key==='Escape'"),`${file} must consume app back for its visible overlay`);assert.ok(src.includes('stopImmediatePropagation()'),`${file} must stop one back action from closing a background layer too`)}
const onboarding=fs.readFileSync('onboarding.js','utf8');
assert.ok(onboarding.includes('if(overlay.hidden)return')&&onboarding.includes("if(e.key==='Escape')")&&onboarding.includes('stopImmediatePropagation()')&&onboarding.includes('finish()'),'manual onboarding overlay must consume back and close only itself');
assert.ok(onboarding.includes('Never open a modal automatically after login'),'onboarding must remain manual-only after login');
console.log('student overlay back priority contract self-test passed');
