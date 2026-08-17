const assert=require('assert');
const fs=require('fs');
const questions=fs.readFileSync('question-data.js','utf8');
const hub=fs.readFileSync('assets/student-study-menu.js','utf8');
const taxonomy=fs.readFileSync('activity-taxonomy.js','utf8');
const metadata=fs.readFileSync('server/activity-metadata.js','utf8');

const ids=[...questions.matchAll(/id:'(r\d{2})'/g)].map(match=>match[1]);
assert.strictEqual(ids.length,30,'exploration needs 30 riddles');
assert.strictEqual(new Set(ids).size,30,'riddle ids must be unique');
assert.strictEqual((questions.match(/difficulty:'easy'/g)||[]).length,15,'forest needs 15 easy candidates');
assert.strictEqual((questions.match(/difficulty:'challenge'/g)||[]).length,15,'dungeon needs 15 challenge candidates');
assert.match(hub,/id:'riddle-forest'[\s\S]*difficulty:'easy'[\s\S]*count:5/,'forest must select five easy riddles');
assert.match(hub,/id:'riddle-dungeon'[\s\S]*difficulty:'challenge'[\s\S]*count:7/,'dungeon must select seven challenge riddles');
assert.match(hub,/filter\(item=>item\.difficulty===exp\.difficulty\)/,'expeditions must use separate difficulty pools');
assert.match(hub,/Math\.floor\(Math\.random\(\)\*\(i\+1\)\)/,'questions must use Fisher-Yates shuffle');
assert.match(hub,/shuffle\(pool\)\.slice\(0,exp\.count\)/,'each run must draw a random subset');
assert.match(hub,/options=shuffle\(item\.options\)/,'answer choices must be shuffled');
assert.match(hub,/answer:options\.indexOf\(correctText\)/,'answer index must follow shuffled choices');
assert.match(hub,/wizard:\{label:'고위험 보상형'[\s\S]*eventChance:\.82,risk:true/,'wizard must keep high-risk high-reward discovery rules');
assert.match(hub,/dragon:\{label:'도전형'[\s\S]*eventChance:\.70,risk:true/,'dragon must keep challenge discovery rules');
assert.match(hub,/chance=trait\.risk&&!firstCorrect\?0:trait\.eventChance/,'risk NPC first-answer penalty must affect discovery chance');
assert.match(hub,/\/api\/player\/me\/exploration-event/,'discovery rewards must be persisted through the server');
assert.match(hub,/studyvillage:stars-refresh/,'discovery rewards must refresh displayed stars');
assert.match(hub,/index===active\.count-1\?'탐험 결과 보기 🏁':'다음 지역으로 ▶'/,'correct answers must advance or finish the expedition');
assert.match(hub,/function nextStage\(\)\{index\+\+;resolved=false;eventForStage=null;eventClaimed=false;renderMap\(\)\}/,'next stage must reset room state before rendering');
assert.match(hub,/submissionId/,'expedition saves must be idempotent');
assert.match(hub,/REQUEST_TIMEOUT_MS=6000/,'expedition requests must not hang forever');
for(const id of ['exploration-forest-riddle','exploration-mountain-riddle']){
  assert(taxonomy.includes(id),`${id} needs client metadata`);
  assert(metadata.includes(id),`${id} needs server metadata`);
}
console.log('student unified random exploration contract selftest passed');
