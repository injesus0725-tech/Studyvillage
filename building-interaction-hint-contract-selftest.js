const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('building-interiors.js','utf8');
assert.ok(src.includes("function hideHint(){if(hint)hint.classList.remove('visible')}"),'building interaction hint needs a shared hide helper');
assert.ok(src.includes('else hideHint()}else hideHint()'),'hint must disappear when no building is nearby or the game is inactive');
assert.ok(src.includes('current=null;hideHint();document.body.classList.remove'),'leaving an interior must clear stale interaction hints');
console.log('building interaction hint contract self-test passed');
