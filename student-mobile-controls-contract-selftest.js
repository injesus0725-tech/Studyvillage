const assert=require('assert');
const fs=require('fs');
const css=fs.readFileSync('style.css','utf8');

assert.ok(css.includes('@media(max-width:700px),(pointer:coarse)'),'touch devices must show mobile controls even on wide tablets');
assert.ok(css.includes('grid-template-columns:156px minmax(112px,1fr)'),'mobile controls must place the direction pad and interaction button side by side');
assert.ok(css.includes('.mobile-controls .talk-button{grid-column:2;grid-row:1/3;width:100%;height:88px'),'interaction must remain visible beside both direction rows');
assert.ok(css.includes('env(safe-area-inset-bottom)'),'mobile controls must stay above the device safe area');
assert.ok(css.includes('touch-action:none'),'direction presses must not turn into browser gestures');
console.log('student mobile controls contract selftest passed');
