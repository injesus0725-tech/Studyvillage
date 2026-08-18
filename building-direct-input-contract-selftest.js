const fs=require('fs');const assert=require('assert');const src=fs.readFileSync('building-interiors.js','utf8');
assert.ok(src.includes("el.addEventListener('click'"),'buildings must open through a normal click/tap event');
assert.ok(!src.includes("addEventListener('pointerup'"),'building actions must not duplicate click with pointerup');
assert.ok(!src.includes("window.addEventListener('keydown'"),'building entry must not depend on keyboard interaction');
assert.ok(!src.includes("talk?.addEventListener"),'building entry must not depend on the old talk button');
assert.ok(src.includes('StudyVillageMovement?.stop'),'opening/closing buildings must stop map movement');
console.log('building direct input contract self-test passed');
