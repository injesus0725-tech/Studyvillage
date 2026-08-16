const fs=require('fs'),assert=require('assert');
const session=fs.readFileSync('student-session.js','utf8');

for(const token of ['.sv-mission-panel:not([hidden]) .claim:disabled','.sv-collection-panel:not([hidden]) button:disabled','#customize-panel:not([hidden]) #customize-save:disabled','.math-practice-panel:not([hidden]) [data-submit]:disabled','#library-game:not([hidden])','.sv-expedition-panel:not([hidden]) .sv-expedition-result','.sv-discovery-panel:not([hidden]) .primary:disabled'])assert.ok(session.includes(token),`save/exit lock missing: ${token}`);
assert.ok(session.includes("alert('기록을 안전하게 저장하고 있어요."),'students must receive a plain-language save lock notice');
const switchStart=session.indexOf("button.addEventListener('click'"),exitStart=session.indexOf("exitButton.addEventListener('click'");
assert.ok(session.indexOf('if(guardWrite())return',switchStart)<exitStart,'student switching must stop before logout while a write is active');
assert.ok(session.indexOf('if(guardWrite())return',exitStart)>exitStart,'intentional exit must stop before logout while a write is active');
console.log('student session save exit lock contract self-test passed');
