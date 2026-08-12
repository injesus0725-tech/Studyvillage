const fs=require('fs');
const assert=require('assert');

const checks=[
  ['admin.js',['pendingStudentActions','loading=false','restoring=false','changingAdminPassword=false']],
  ['admin-score-alerts.js',['pending=new Set()','loading=false']],
  ['admin-question-review.js',['loading=false','reviewsLoading=null','historyLoading=false','savingReviews=new Set()']],
  ['admin-question-editor.js',['saving=false','renderPromise=null']],
  ['admin-stars.js',['adjusting=false','studentsLoading=null','selectedLoadSeq=0']],
  ['admin-shop.js',['saving=false','loading=false']],
  ['admin-attempt-policy.js',['loading=false','historyLoading=false']],
  ['admin-presence.js',['loading=false']],
  ['admin-live-events.js',['sending=false','audienceLoading=false']],
  ['admin-activity-state.js',['pending=new Set()','loading=false']],
  ['admin-errors.js',['clearing=false','loading=false','exporting=false']]
];

for(const [file,tokens] of checks){
  const src=fs.readFileSync(file,'utf8');
  for(const token of tokens)assert.ok(src.includes(token),`${file}: missing concurrency guard ${token}`);
}

console.log('admin runtime concurrency contract self-test passed');
