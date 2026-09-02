const assert=require('assert');
const fs=require('fs');

const hub=fs.readFileSync('assets/student-exploration-v2.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const checkpoint=fs.readFileSync('activity-checkpoint.js','utf8');

assert.match(hub,/const EXPS=\[/,'exploration v2 must own the expedition catalog');
assert.match(hub,/id:'math-add'/,'addition expedition must be available');
assert.match(hub,/id:'math-mul'/,'multiplication expedition must be available');
assert.match(hub,/id:'forest'/,'riddle forest must be available');
assert.match(hub,/id:'mountain'/,'challenge mountain must be available');
assert.match(hub,/data-subject="all"/,'exploration v2 must provide subject filters');
assert.match(hub,/data-route/,'exploration v2 must expose journey progress');
assert.match(hub,/StudyVillageQuestionSets/,'exploration v2 must use the shared question bank');
assert.match(hub,/AbortController/,'exploration v2 requests must be bounded');
assert.match(checkpoint,/window\.StudyVillageCheckpoint=\(\(\)=>\{/,'shared checkpoint service must exist');
assert.match(checkpoint,/return\{save,load,clear,list,sync,/,'checkpoint service must support save/load/clear and device sync');
assert.match(index,/activity-checkpoint\.js[\s\S]*assets\/student-exploration-v2\.js/,'checkpoint service must load before exploration v2');
assert.match(index,/village-layout\.js[\s\S]*assets\/student-exploration-v2\.js/,'exploration v2 must load after shared village layout');
assert.doesNotMatch(index,/assets\/student-study-menu\.js/,'legacy exploration study menu must not load in production');
assert.doesNotMatch(index,/legacy-exploration-retirement\.js/,'temporary retirement shim must not be required by production');

console.log('student exploration v2 map contract selftest passed');
