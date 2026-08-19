const fs=require('fs'),assert=require('assert');
const renderer=fs.readFileSync('avatar-renderer.js','utf8'),css=fs.readFileSync('avatar-assets.css','utf8');
for(const token of ['SLOT_DEFAULTS','hat:{anchor:\'head\'','glasses:{anchor:\'eyes\'','bag:{anchor:\'back\'','pet:{anchor:\'pet-right\'','hand:{anchor:\'hand-right\'','shoes:{anchor:\'feet\''])assert.ok(renderer.includes(token),`avatar equipment standard must keep ${token}`);
for(const id of ['cap-blue','crown-gold','glasses-round','backpack','pet-chick','pet-cat','leaf-cap','scholar-cap','explorer-goggles','star-monocle','field-satchel','book-pack','pet-owl','pet-fox'])assert.ok(renderer.includes(`'${id}'`),`${id} must use the shared avatar catalog`);
for(const token of ['--sv-item-scale','--sv-item-x','--sv-item-y','dataset.avatarSlot','dataset.avatarAnchor','applyPlacement'])assert.ok(renderer.includes(token)||css.includes(token),`standardized placement must keep ${token}`);
assert.ok(css.includes('.avatar-layer,.preview-layer'),'player and preview items must share one adjustment mechanism');
assert.ok(css.includes('translate:var(--sv-item-x) var(--sv-item-y)')&&css.includes('scale:var(--sv-item-scale)'),'item-specific placement must be CSS-variable based');
console.log('avatar equipment standard contract self-test passed');
