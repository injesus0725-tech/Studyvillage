const fs=require('fs'),assert=require('assert');
const overlayOwners=['customize.js','village-layout.js','daily-missions.js','exploration-collection.js'];
for(const file of overlayOwners){const src=fs.readFileSync(file,'utf8');assert.ok(src.includes("event.key==='Escape'")||src.includes("e.key==='Escape'"),`${file} must consume app back for its visible overlay`);assert.ok(src.includes('stopImmediatePropagation()'),`${file} must stop one back action from closing a background layer too`)}
const catalog=fs.readFileSync('random-exploration-events.js','utf8');
assert.ok(catalog.includes('StudyVillageExpeditionEvents')&&!catalog.includes('createElement'),'random exploration events must remain a data-only expedition catalog and must not own an overlay/back handler');
const onboarding=fs.readFileSync('onboarding.js','utf8');
assert.ok(onboarding.includes("if(!overlay.hidden&&event.key==='Escape')")&&onboarding.includes('event.preventDefault();close()'),'manual onboarding overlay must consume Escape only while visible and close only itself');
assert.ok(onboarding.includes('overlay.hidden=true')&&!onboarding.includes('studyvillage:first-character-choice'),'onboarding must remain manual-only after login');
console.log('student overlay back priority contract self-test passed');
