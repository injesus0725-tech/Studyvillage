const fs=require('fs'),assert=require('assert');
const root='assets/avatar-rpg',manifest=JSON.parse(fs.readFileSync(`${root}/manifest.json`,'utf8'));
assert.deepStrictEqual(manifest.canvas,{width:512,height:512},'RPG avatar layers must share a 512px square canvas');
assert.deepStrictEqual(Object.keys(manifest.bases),['student-boy','student-girl'],'only boy and girl production bases may remain');
assert.ok(!JSON.stringify(manifest).includes('student-default'),'duplicate default student must not return');
for(const file of [...Object.values(manifest.bases),manifest.reference])assert.ok(fs.statSync(`${root}/${file}`).size>1000,`${file} must be a real production asset`);
for(const slot of ['face','expression','hair','hat','glasses','outfit','bottom','shoes','bag','hand','pet'])assert.ok(manifest.slots.includes(slot),`${slot} slot missing`);
assert.equal(manifest.rules.noLegacySvgMixing,true,'new RPG layers must switch as one coherent asset family');
console.log('RPG avatar production foundation contract self-test passed');
