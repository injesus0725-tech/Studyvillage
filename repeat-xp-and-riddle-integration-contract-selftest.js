const fs=require('fs'),assert=require('assert');
const policy=fs.readFileSync('server/activity-attempt-settings.js','utf8');
const hub=fs.readFileSync('assets/student-exploration-v2.js','utf8');
const stability=fs.readFileSync('assets/student-stability-fixes.js','utf8');
const building=fs.readFileSync('building-interiors.js','utf8');
for(const id of ['exploration-korean','exploration-math','exploration-random']){
  assert.ok(policy.includes(`'${id}':Object.freeze({mode:'limited'`)&&new RegExp(`'${id}'.{0,120}xpMode:'every-attempt'`).test(policy),`${id} must reward every teacher-allowed fresh completion`);
}
for(const id of ['riddle-demo','exploration-social','exploration-science'])assert.ok(!policy.includes(`'${id}':Object.freeze({mode:'limited'`),`${id} must stay retired from active attempt policies`);
assert.ok(policy.includes("RETIRED_ACTIVITY_IDS=new Set(['riddle-demo','exploration-social','exploration-science'])"),'old saved retired policies must be filtered');
assert.ok(policy.includes('REPEAT_XP_ACTIVITIES.has(id)')&&policy.includes("xpMode:'every-attempt'"),'saved first-completion settings must migrate to repeat XP for normal learning activities');
assert.ok(!hub.includes('data-subject="수수께끼"')&&!hub.includes("name:'수수께끼 숲'")&&!hub.includes("name:'도전의 산'"),'standalone riddle exploration UI must stay removed');
assert.ok(!stability.includes('수수께끼 도전 시작')&&stability.includes('legacyQuizPanel.hidden=true'),'legacy standalone riddle UI must remain retired');
assert.ok(building.includes("{id:'quiz',selector:'#quiz-hall',icon:'➕',title:'수학 놀이터'")&&building.includes("action:'math'"),'the old hall must now belong exclusively to village math practice');
console.log('repeat XP, retired standalone riddle, and restored village math contract self-test passed');
