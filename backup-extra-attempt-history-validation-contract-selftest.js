const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator-with-stars.js','utf8');
for(const token of [
  "const EXTRA_ATTEMPT_HISTORY_KEY='activity-attempt-extra-history:v1'",
  "code:'invalid-extra-attempt-history'",
  "code:'invalid-extra-attempt-history-entry'",
  "code:'orphan-extra-attempt-history-entry'",
  "!SAFE_ACTIVITY.test(String(entry.activityId||''))",
  "!['grant','set','consume'].includes(entry.type)",
  "Number(entry.after)!==Number(entry.before)+Number(entry.amount)",
  "extraAttemptHistoryCount=history.length"
])assert.ok(src.includes(token),`extra-attempt history backup validation missing: ${token}`);
assert.ok(src.indexOf("key===EXTRA_ATTEMPT_HISTORY_KEY")<src.indexOf("key.startsWith(EXTRA_ATTEMPT_PREFIX)"),'history key must be handled before generic extra-attempt prefix');
console.log('backup extra attempt history validation contract self-test passed');
