const fs=require('fs'),assert=require('assert');
const src=fs.readFileSync('assets/expedition-npc-variety.js','utf8');
assert.ok(src.includes('const NPC_SPOTS=['),'expanded NPC spot pool missing');
assert.ok(src.includes('2+Math.floor(Math.random()*2)'),'expedition must show 2-3 NPCs');
assert.ok(src.includes("original.dataset.randomNpcPosition='1'"),'original challenge NPC must also move between rooms');
assert.ok(src.includes("mode:'choice'")&&src.includes("mode:'random'")&&src.includes("mode:'keyword'")&&src.includes("mode:'hint'")&&src.includes("mode:'judge'")&&src.includes("mode:'brave'"),'NPC behavior variety incomplete');
assert.ok(src.includes('StudyVillageExpeditionCamera?.ensureSize'),'NPC spread must cooperate with expanded expedition camera');
console.log('expanded expedition NPC spread contract: ok');
