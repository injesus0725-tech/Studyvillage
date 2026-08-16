const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('village-layout.js','utf8');

assert.ok(src.includes('{regionId:region.id,questions,index,correct,answeredChoice,submissionId,pendingStars:'),'expedition checkpoint must preserve the randomized route, scoring state, and provisional stars');
assert.ok(src.includes('p.questions.length!==region.count'),'checkpoint must match the selected expedition length');
assert.ok(src.includes('이전에 걷던 ${region.name} 기록이 있어요. ${saved.index+1}번째 길부터 이어서 탐험할까요?'),'student must be offered an explicit resume choice');
for(const restored of ['questions=saved.questions','index=saved.index','correct=saved.correct','answeredChoice=saved.answeredChoice','submissionId=saved.submissionId']){
  assert.ok(src.includes(restored),`resume must restore ${restored}`);
}
assert.ok(src.includes('render(resume?answeredChoice:null)'),'resume must restore an answered current question');
assert.ok(src.includes('else answer(restoredChoice,true)'),'restored answer must render in locked review state');
assert.ok(src.includes('if(!restoring)correct++'),'restored correct answer must not score twice');
assert.ok(src.includes('refreshMapProgress();clearCheckpoint()'),'successful result save must clear the expedition checkpoint');
assert.ok(src.includes("if(error?.code==='attempt-limit-reached'){clearCheckpoint();"),'terminal attempt-limit result must clear the expedition checkpoint');
assert.ok(src.includes('결과 다시 저장하기 ↻'),'transient save failure must retain a retry path');

console.log('student expedition checkpoint contract selftest passed');
