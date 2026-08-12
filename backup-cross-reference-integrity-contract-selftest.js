const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator.js','utf8');
for(const token of [
  "!names.has(String(row.player_name||''))",
  "!names.has(player)",
  'activityKeys.has(key)',
  'reportIds.has(reportId)',
  'ledgerIds.has(id)',
  '!ledgerIds.has(ledgerId)',
  'reviewedLedgerIds.has(ledgerId)',
  '!ledgerIds.has(Number(row[ref]))',
  'correctionIds.has(id)'
])assert.ok(src.includes(token),`backup cross-reference guard missing: ${token}`);
assert.ok(src.includes("return fail('invalid-activity-log'"),'orphan activity logs must be rejected');
assert.ok(src.includes("return fail('invalid-score-review'"),'orphan score reviews must be rejected');
assert.ok(src.includes("return fail('invalid-score-correction-ledger'"),'orphan correction ledger references must be rejected');
console.log('backup cross reference integrity contract self-test passed');
