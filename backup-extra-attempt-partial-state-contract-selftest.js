const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator-with-stars.js','utf8');
for(const token of [
  "code:'orphan-extra-attempt-history-scope'",
  "if(!extraAttemptBalances.has(scope))",
  "code:'extra-attempt-current-balance-mismatch'",
  "if(extraAttemptBalances.get(scope)!==lastBalance)",
  "code:'duplicate-backup-setting-key'",
  "code:'duplicate-extra-attempt-history-id'"
])assert.ok(src.includes(token),`partial extra-attempt backup guard missing: ${token}`);
assert.ok(src.includes("if(!extraAttemptBalances.has(scope)){const [playerName,activityId]=scope.split('\\u0000');return{ok:false,code:'orphan-extra-attempt-history-scope'"),'history without current balance must fail closed');
console.log('backup extra attempt partial state contract self-test passed');
