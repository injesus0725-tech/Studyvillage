const fs=require('fs'),assert=require('assert');
const policy=fs.readFileSync('server/activity-attempt-settings.js','utf8');
const hub=fs.readFileSync('assets/student-exploration-v2.js','utf8');
const stability=fs.readFileSync('assets/student-stability-fixes.js','utf8');
for(const id of ['exploration-korean','exploration-math','exploration-random']){
  assert.ok(policy.includes(`'${id}':Object.freeze({mode:'limited'`)&&new RegExp(`'${id}'.{0,120}xpMode:'every-attempt'`).test(policy),`${id} must reward every teacher-allowed fresh completion`);
}
for(const id of ['riddle-demo','exploration-social','exploration-science'])assert.ok(!policy.includes(`'${id}':Object.freeze({mode:'limited'`),`${id} must stay retired from active attempt policies`);
assert.ok(policy.includes("RETIRED_ACTIVITY_IDS=new Set(['riddle-demo','exploration-social','exploration-science'])"),'old saved retired policies must be filtered');
assert.ok(policy.includes('REPEAT_XP_ACTIVITIES.has(id)')&&policy.includes("xpMode:'every-attempt'"),'saved first-completion settings must migrate to repeat XP for normal learning activities');
assert.ok(!hub.includes('data-subject="수수께끼"')&&!hub.includes("name:'수수께끼 숲'")&&!hub.includes("name:'도전의 산'"),'standalone riddle exploration UI must stay removed');
assert.ok(stability.includes("legacyQuizHall.style.setProperty('left','-10000px','important')")&&!stability.includes('수수께끼 도전 시작'),'legacy standalone riddle hall must be inert rather than relaunched by a stability shim');
console.log('repeat XP and retired standalone riddle integration contract self-test passed');
