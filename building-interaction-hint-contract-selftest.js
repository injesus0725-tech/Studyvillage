const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('building-interiors.js','utf8');
assert.ok(src.includes("function hideHint(){hint.classList.remove('visible');document.body.classList.remove('near-building-interaction')}"),'building interaction hint needs a shared hide helper that clears proximity state');
assert.ok(src.includes('if(now-lastCheck>=160)'),'building proximity geometry checks must be throttled for tablet responsiveness');
assert.ok(src.includes('if(active&&!open)')&&src.includes('else hideHint()}else hideHint()'),'hint must disappear when no building is nearby, an interior is open, or the game is inactive');
assert.ok(src.includes('current=null;hideHint();document.body.classList.remove(\'inside-building\')'),'leaving an interior must clear stale interaction hints and interior state');
console.log('throttled building interaction hint contract self-test passed');
