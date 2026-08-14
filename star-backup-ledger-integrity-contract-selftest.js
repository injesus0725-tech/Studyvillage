const fs=require('fs');
const assert=require('assert');
const star=fs.readFileSync('server/star-backup-validator.js','utf8');
const combined=fs.readFileSync('server/backup-validator-with-stars.js','utf8');
for(const token of [
  'entries.length>MAX_MIRROR_ENTRIES',
  'after-before!==delta',
  'previous&&previous.after!==before',
  'star-mirror-discontinuity:',
  'star-mirror-balance-history-mismatch',
  'duplicate-balance:',
  'id<=previousId',
  'ledger-player-name-missing:',
  'ledger-kind-missing:',
  'ledger-created-at-missing:'
])assert.ok(star.includes(token),`star backup ledger guard missing: ${token}`);
for(const token of [
  "code:'orphan-star-backup-setting'",
  "code:'invalid-star-backup-setting'",
  "code:'star-balance-mismatch'"
])assert.ok(combined.includes(token),`combined star backup guard missing: ${token}`);
console.log('star backup ledger integrity contract self-test passed');
