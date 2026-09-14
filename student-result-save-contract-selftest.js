const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('library-game.js','utf8');
for(const token of [
  "if(saving)return",
  "SAVE_TIMEOUT_MS=5000",
  "QUESTION_TIMEOUT_MS=5000",
  "async function timedFetch",
  "timedFetch('/api/question-overrides'",
  "if(opening||!panel.hidden||explorationOpen())return",
  "opening=true",
  "finally{opening=false}",
  "saveCheckpoint();",
  "clearCheckpoint();",
  "결과 다시 저장하기 ↻",
  "이번 ${score}점은 이 기기에 임시 보관했어요.",
  "submissionId=submissionId||newSubmissionId()",
  "studyvillage:return-to-village"
]){
  assert.ok(src.includes(token),`학생 결과 저장/문제 시작 복구 흐름 누락: ${token}`);
}

console.log('student result save recovery contract self-test passed');
