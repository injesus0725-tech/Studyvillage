const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/server.js','utf8');
const start=src.indexOf('const resetStudentRecord=db.transaction');
const end=src.indexOf("app.post('/api/admin/player/:name/reset-record'",start);
assert.ok(start>=0&&end>start,'student record reset transaction must exist');
const block=src.slice(start,end);
for(const token of [
  'total_score=0',
  'attempts=0',
  'best_score=0',
  'last_score=0',
  'xp=0',
  "base_character='student-default'",
  "equipment_json='{}'",
  "DELETE FROM activity_records WHERE player_name=?",
  "logActivity(n,'record-reset'"
])assert.ok(block.includes(token),`student record reset guard missing: ${token}`);
for(const forbidden of [
  'password_hash=',
  'password_salt=',
  'login_count=0',
  'last_login_at=',
  'owned_items_json=',
  'DELETE FROM star_ledger',
  'DELETE FROM score_ledger',
  'DELETE FROM score_corrections',
  'DELETE FROM score_alert_reviews',
  'compat:stars:',
  'activity-attempt-extra:v1:',
  'removeExtraAttemptStudentData(',
  'DELETE FROM players WHERE name=?'
])assert.ok(!block.includes(forbidden),`record reset must preserve account/economy/audit/extra-attempt state: ${forbidden}`);
assert.ok(src.includes("app.get('/api/player/me/score-ledger',requireSession"),'preserved score audit history must remain available to the student after reset');
console.log('student record reset boundary and audit preservation contract self-test passed');
