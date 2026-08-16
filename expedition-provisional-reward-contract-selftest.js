const fs=require('fs');
const assert=require('assert');
const client=fs.readFileSync('village-layout.js','utf8');
const activity=fs.readFileSync('server/activity-attempt-student.js','utf8');
const stars=fs.readFileSync('server/star-ledger.js','utf8');

assert.ok(client.includes('function pendingStarsFor(activityId,score)'), '학생 화면은 탐험 임시 별을 서버 규칙과 같은 점수 기준으로 계산해야 합니다.');
assert.ok(client.includes('pendingStars:pendingStarsFor'), '이어하기 체크포인트에 임시 별 진행값을 보관해야 합니다.');
assert.ok(client.includes('임시 ${pending}별'), '탐험 중 별이 아직 확정되지 않았음을 표시해야 합니다.');
assert.ok(client.includes('Number(result.expeditionStars)||0'), '완료 응답의 서버 확정 별만 결과에 표시해야 합니다.');
assert.ok(client.includes('임시 별을 확정하지 못했어요'), '저장 실패 시 임시 별을 실제 보상처럼 안내하면 안 됩니다.');
assert.ok(activity.includes('validExpeditionScore(activityId,score)'), '서버는 탐험별 가능한 완료 점수만 받아야 합니다.');
assert.ok(activity.includes("activityId.startsWith('exploration-')&&!submissionId"), '탐험 완료에는 재시도 식별자가 필수여야 합니다.');
assert.ok(activity.includes('commitExpeditionReward(db,{name,activityId,score,submissionId,now})'), '활동 기록과 별 확정을 같은 DB 트랜잭션 안에서 실행해야 합니다.');
assert.ok(stars.includes("kind='expedition-completion' AND reference_id=?"), '완료 식별자로 이미 확정된 보상을 검사해야 합니다.');
assert.ok(stars.includes("'expedition-completion',submissionId"), '탐험 별 장부에 완료 식별자를 기록해야 합니다.');
assert.ok(stars.includes('if(prior)return{stars:0,balance:prior.balance,alreadyClaimed:true}'), '같은 완료 요청을 다시 보내도 별을 중복 지급하면 안 됩니다.');
assert.ok(stars.includes('writeMirror(db,name)'), '확정된 별은 기존 백업 호환 사본에도 함께 기록해야 합니다.');
console.log('expedition provisional reward contract self-test passed');
