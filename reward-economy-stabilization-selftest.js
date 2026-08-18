const fs=require('fs'),assert=require('assert');
const src=fs.readFileSync('server/reward-economy.js','utf8');
assert.ok(src.includes('targetLevel:20'),'semester growth target must be classroom-scale, not Lv.70');
assert.ok(src.includes("id.startsWith('exploration-')"),'exploration must have a separate XP band');
assert.ok(src.includes('return 18+Math.round(percent*7)'),'exploration XP must stay low because stars/collection are its primary reward');
assert.ok(src.includes("id==='math-arithmetic'||id==='library-vocabulary'||id==='vocabulary'"),'learning activities must remain primary XP sources');
assert.ok(!src.includes('return 280+'),'legacy oversized per-activity XP must not return');
console.log('reward economy stabilization self-test passed');
