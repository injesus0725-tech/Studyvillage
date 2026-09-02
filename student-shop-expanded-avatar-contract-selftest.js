const fs=require('fs');
const assert=require('assert');
const source=fs.readFileSync('student-shop.js','utf8');
for(const slot of ['hair','outfit','bottom','shoes','hand'])assert.ok(source.includes(`data-shop-slot=\"${slot}\"`),`shop filter missing: ${slot}`);
assert.ok(source.includes('function paintShopPreview'),'avatar shop preview renderer missing');
assert.ok(source.includes("renderer.paintAvatarBase(base,'student-girl')"),'shop preview base missing');
assert.ok(source.includes("renderer.paintItem(part,item.id)"),'shop item visual preview missing');
assert.ok(source.includes("slotLabels={hair:'머리'"),'expanded slot labels missing');
console.log('student shop expanded avatar contract self-test passed');
