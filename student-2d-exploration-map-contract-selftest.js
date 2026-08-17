const assert=require('assert');
const fs=require('fs');

const hub=fs.readFileSync('assets/student-study-menu.js','utf8');
const index=fs.readFileSync('index.html','utf8');

assert.match(hub,/const EXPEDITIONS=\[/,'student study menu must own the expedition catalog');
assert.match(hub,/id:'math-addition-cave'/,'addition expedition must be available');
assert.match(hub,/id:'math-multiplication-dungeon'/,'multiplication expedition must be available');
assert.match(hub,/id:'riddle-forest'/,'riddle forest must be available');
assert.match(hub,/id:'riddle-dungeon'/,'riddle dungeon must be available');
assert.match(hub,/data-subject="all"/,'hub must provide subject filters');
assert.match(hub,/data-stage-map/,'expeditions must render through the unified stage map');
assert.match(hub,/data-stage-route/,'unified stage must expose journey progress');
assert.match(hub,/fetchJson\('/,'unified expedition flow must use authenticated request handling');
assert.match(hub,/StudyVillageCheckpoint/,'unified expedition flow must preserve resumable progress');
assert.match(index,/village-layout\.js[\s\S]*assets\/student-study-menu\.js/,'unified study menu must load after shared village layout');
assert.doesNotMatch(index,/legacy-exploration-retirement\.js/,'temporary retirement shim must not be required by production');

console.log('student unified exploration hub contract selftest passed');
