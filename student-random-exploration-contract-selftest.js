const assert=require('assert');
const fs=require('fs');
const questions=fs.readFileSync('question-data.js','utf8');
const hub=fs.readFileSync('assets/student-exploration-v2.js','utf8');
const taxonomy=fs.readFileSync('activity-taxonomy.js','utf8');
const metadata=fs.readFileSync('server/activity-metadata.js','utf8');
const index=fs.readFileSync('index.html','utf8');

const ids=[...questions.matchAll(/id:'(r\d{2})'/g)].map(match=>match[1]);
assert.strictEqual(ids.length,30,'exploration needs 30 riddles');
assert.strictEqual(new Set(ids).size,30,'riddle ids must be unique');
assert.strictEqual((questions.match(/difficulty:'easy'/g)||[]).length,15,'forest needs 15 easy candidates');
assert.strictEqual((questions.match(/difficulty:'challenge'/g)||[]).length,15,'mountain needs 15 challenge candidates');
assert.doesNotMatch(hub,/name:'수수께끼 숲'|name:'도전의 산'|data-subject="수수께끼"/,'수수께끼는 별도 탐험이나 필터로 분리하지 않습니다.');
assert.match(hub,/riddles=eligible\.filter\(q=>q\.subject==='창의적 사고'\)/,'수수께끼 문제는 탐험 공통 문제 풀에서 찾아야 합니다.');
assert.match(hub,/baseSubjectPool=exp\.subject==='랜덤'\?eligible:\[\.\.\.curriculum\.filter[\s\S]*\.\.\.riddles\]/,'교과 탐험에도 수수께끼가 무작위로 섞여야 합니다.');
assert.match(hub,/Math\.floor\(Math\.random\(\)\*\(i\+1\)\)/,'questions must use Fisher-Yates shuffle');
assert.match(hub,/shuffle\(q\.options\)/,'answer choices must be shuffled');
assert.match(hub,/answer:options\.indexOf\(correct\)/,'answer index must follow shuffled choices');
assert.match(hub,/const NPCS=\[/,'v2 exploration must include random NPC encounters');
assert.match(hub,/const REWARDS=\[/,'v2 exploration must include random discoveries');
assert.match(hub,/const PATHS=\[/,'v2 exploration must offer path choices');
assert.match(hub,/submission/,'expedition saves must carry an idempotent submission id');
assert.match(hub,/REQUEST_TIMEOUT=7000/,'expedition requests must not hang forever');
assert.match(index,/question-data\.js[\s\S]*assets\/student-exploration-v2\.js/,'question data must load before exploration v2');
assert.doesNotMatch(index,/assets\/student-study-menu\.js/,'retired exploration menu must not load in production');
for(const id of ['exploration-forest-riddle','exploration-mountain-riddle']){assert(taxonomy.includes(id),`${id} legacy records need client metadata`);assert(metadata.includes(id),`${id} legacy records need server metadata`)}
console.log('student random exploration v2 contract selftest passed');
