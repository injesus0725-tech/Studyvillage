const assert=require('assert');
const fs=require('fs');
const questions=fs.readFileSync('question-data.js','utf8');
const layout=fs.readFileSync('village-layout.js','utf8');
const taxonomy=fs.readFileSync('activity-taxonomy.js','utf8');
const metadata=fs.readFileSync('server/activity-metadata.js','utf8');

const ids=[...questions.matchAll(/id:'(r\d{2})'/g)].map(match=>match[1]);
assert.strictEqual(ids.length,30,'exploration needs 30 riddles');
assert.strictEqual(new Set(ids).size,30,'riddle ids must be unique');
assert.strictEqual((questions.match(/difficulty:'easy'/g)||[]).length,15,'forest needs 15 easy candidates');
assert.strictEqual((questions.match(/difficulty:'challenge'/g)||[]).length,15,'mountain needs 15 challenge candidates');
assert.match(layout,/difficulty:'easy',count:5/,'forest must select five easy riddles');
assert.match(layout,/difficulty:'challenge',count:7/,'mountain must select seven challenge riddles');
assert.match(layout,/filter\(item=>item\.difficulty===difficulty\)/,'regions must use separate difficulty pools');
assert.match(layout,/Math\.floor\(Math\.random\(\)\*\(i\+1\)\)/,'questions must use Fisher-Yates shuffle');
assert.match(layout,/shuffle\(source\)\.slice\(0,region\.count\)\.map\(prepareQuestion\)/,'each run must draw a random subset');
assert.match(layout,/options=shuffle\(item\.options\)/,'answer choices must be shuffled');
assert.match(layout,/answer:options\.indexOf\(correctText\)/,'answer index must follow shuffled choices');
assert.match(layout,/submissionId/,'exploration saves must be idempotent');
assert.match(layout,/controller\.abort\(\),5000/,'exploration saves must not hang forever');
for(const id of ['exploration-forest-riddle','exploration-mountain-riddle']){
  assert(taxonomy.includes(id),`${id} needs client metadata`);
  assert(metadata.includes(id),`${id} needs server metadata`);
}
console.log('student random exploration contract selftest passed');
