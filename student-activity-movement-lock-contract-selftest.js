const fs=require('fs'),assert=require('assert');
const game=fs.readFileSync('game.js','utf8');

assert.ok(game.includes('const builtInAnyPanel=anyPanel'),'dynamic learning activities must extend the base movement lock');
for(const selector of ['.math-practice-panel:not([hidden])','#library-game:not([hidden])','#building-interior:not([hidden])'])assert.ok(game.includes(selector),`movement lock missing for ${selector}`);
assert.ok(game.includes("new MutationObserver(()=>{if(anyPanel())clearMovementKeys()})"),'opening any activity must release a direction key that was already held');
assert.ok(game.includes("attributeFilter:['hidden']"),'activity movement locking must react to open and close transitions');
console.log('student activity movement lock contract self-test passed');
