const fs=require('fs'),assert=require('assert');
const files=['customize.js','daily-missions.js','exploration-collection.js','random-exploration-events.js','onboarding.js'];
for(const file of files){const src=fs.readFileSync(file,'utf8');assert.ok(src.includes("event.key==='Escape'")||src.includes("e.key==='Escape'"),`${file} must consume app back for its visible overlay`);assert.ok(src.includes('stopImmediatePropagation()'),`${file} must stop one back action from closing a background layer too`)}
const layout=fs.readFileSync('village-layout.js','utf8');
assert.ok(layout.includes("if(event.key!=='Escape'||ranking.hidden)return"),'ranking overlay must ignore non-Escape keys and already-hidden state');
assert.ok(layout.includes('event.preventDefault();event.stopImmediatePropagation();ranking.hidden=true'),'ranking Escape must consume exactly one app-back action');
const onboarding=fs.readFileSync('onboarding.js','utf8');
assert.ok(onboarding.includes('if(overlay.hidden)return')&&onboarding.includes("if(e.key==='Escape')")&&onboarding.includes('stopImmediatePropagation()')&&onboarding.includes('finishGuide()'),'manual onboarding overlay must consume back and close only itself');
assert.ok(onboarding.includes('Never open a modal automatically after login.')&&!onboarding.includes('studyvillage:first-character-choice'),'onboarding must remain manual-only after login');
const building=fs.readFileSync('building-interiors.js','utf8');
assert.ok(building.includes('foregroundPanelOpen()')&&building.includes('if(foregroundPanelOpen())return'),'a building interior must not consume the same Escape used by a foreground activity');
console.log('student overlay back priority contract self-test passed');
