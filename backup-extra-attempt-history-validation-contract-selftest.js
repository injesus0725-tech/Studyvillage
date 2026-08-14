const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator-with-stars.js','utf8');
for(const token of [
  "const EXTRA_ATTEMPT_HISTORY_KEY='activity-attempt-extra-history:v1'",
  "const validCanonicalPlayerName=value=>",
  "code:'invalid-extra-attempt-history-player'",
  "code:'invalid-extra-attempt-backup-player'",
  "encodeURIComponent(playerName)!==encodedName",
  "code:'invalid-extra-attempt-history-json'",
  "code:'invalid-extra-attempt-history-size'",
  "code:'orphan-extra-attempt-history'",
  "code:'invalid-extra-attempt-history-activity'",
  "code:'invalid-extra-attempt-history-type'",
  "code:'invalid-extra-attempt-history-value'",
  "code:'invalid-extra-attempt-history-metadata'",
  "code:'invalid-extra-attempt-history-delta'",
  "code:'extra-attempt-history-balance-mismatch'",
  "code:'duplicate-extra-attempt-history-id'",
  "code:'extra-attempt-history-discontinuity'",
  "code:'extra-attempt-history-time-order'",
  "!Number.isInteger(amount)",
  "!SAFE_ACTIVITY.test(activityId)",
  "!['grant','set','consume'].includes(type)",
  "type==='grant'&&amount<=0",
  "type==='consume'&&amount>=0",
  "after-before!==amount",
  "extraAttemptHistoryCount=history.count"
])assert.ok(src.includes(token),`extra-attempt history backup validation missing: ${token}`);
assert.ok(src.indexOf("key===EXTRA_ATTEMPT_HISTORY_KEY")<src.indexOf("key.startsWith(EXTRA_ATTEMPT_PREFIX)"),'history key must be handled before generic extra-attempt prefix');
assert.ok(src.indexOf("if(!validCanonicalPlayerName(rawName))")<src.indexOf("if(!players.has(name))"),'history player names must be validated before player lookup');
assert.ok(src.indexOf("encodeURIComponent(playerName)!==encodedName")<src.indexOf("if(!players.has(playerName))"),'backup key names must be canonical before player lookup');
assert.ok(src.includes('seenIds.has(id)')&&src.includes('seenIds.add(id)'),'history ids must be unique');
assert.ok(src.includes('previous&&previous.after!==before'),'history balances must remain continuous within a player/activity scope');
assert.ok(src.includes('Date.parse(createdAt)<Date.parse(previous.createdAt)'),'history timestamps must not move backwards within a scope');
console.log('backup extra attempt history and player-name validation contract self-test passed');
