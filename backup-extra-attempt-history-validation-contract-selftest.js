const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator-with-stars.js','utf8');
for(const token of [
  "const EXTRA_ATTEMPT_HISTORY_KEY='activity-attempt-extra-history:v1'",
  "code:'invalid-extra-attempt-history-json'",
  "code:'invalid-extra-attempt-history-size'",
  "code:'orphan-extra-attempt-history'",
  "code:'invalid-extra-attempt-history-activity'",
  "code:'invalid-extra-attempt-history-type'",
  "code:'invalid-extra-attempt-history-value'",
  "code:'invalid-extra-attempt-history-metadata'",
  "code:'invalid-extra-attempt-history-delta'",
  "code:'extra-attempt-history-balance-mismatch'",
  "!Number.isInteger(amount)",
  "!SAFE_ACTIVITY.test(activityId)",
  "!['grant','set','consume'].includes(type)",
  "after-before!==amount",
  "extraAttemptHistoryCount=history.count"
])assert.ok(src.includes(token),`extra-attempt history backup validation missing: ${token}`);
assert.ok(src.indexOf("key===EXTRA_ATTEMPT_HISTORY_KEY")<src.indexOf("key.startsWith(EXTRA_ATTEMPT_PREFIX)"),'history key must be handled before generic extra-attempt prefix');
console.log('backup extra attempt history validation contract self-test passed');
