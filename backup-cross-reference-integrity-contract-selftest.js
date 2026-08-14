const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator.js','utf8');
for(const token of [
  "!names.has(String(row.player_name||''))",
  "!names.has(player)",
  'activityKeys.has(key)',
  'reportIds.has(reportId)',
  'ledgerIds.has(id)',
  'reviewedLedgerIds.has(ledgerId)',
  'ledgerById=new Map()',
  'latestLedgerByTarget=new Map()',
  'ledgerHistoryByTarget=new Map()',
  'sameLedgerScope(ledgerById.get(ledgerId),expected)',
  "return fail('invalid-activity-score-relationship'",
  "return fail('invalid-score-ledger-scope'",
  "return fail('score-ledger-current-value-mismatch'",
  "return fail('score-ledger-discontinuity'",
  "return fail('invalid-score-correction-scope'",
  "return fail('score-correction-ledger-mismatch'",
  "return fail('missing-score-correction-ledger'",
  "return fail('unexpected-score-correction-ledger'",
  "return fail('score-correction-value-mismatch'",
  "return fail('unexpected-score-correction-undo-ledger'",
  "return fail('missing-score-correction-undo-ledger'",
  "return fail('score-correction-undo-value-mismatch'",
  'correctionIds.add(id)'
])assert.ok(src.includes(token),`backup cross-reference/ledger integrity guard missing: ${token}`);
assert.ok(src.includes("return fail('invalid-activity-log'"),'orphan activity logs must be rejected');
assert.ok(src.includes("return fail('invalid-score-review'"),'orphan score reviews must be rejected');
assert.ok(src.includes("return fail('invalid-score-correction-ledger'"),'orphan correction ledger references must be rejected');
assert.ok(src.includes('attempts===0&&(bestScore!==0||lastScore!==0||totalScore!==0)'),'zero-attempt activity records must have zero scores');
assert.ok(src.includes('bestScore<lastScore||totalScore<bestScore||totalScore>attempts*1000'),'activity score relationships must remain internally consistent');
assert.ok(src.includes('current!==ledger.afterValue'),'latest score ledger value must match the restored current value');
assert.ok(src.includes('previous.afterValue!==next.beforeValue'),'score ledger entries for one target must form a continuous value chain');
assert.ok(src.includes('ledger.beforeValue!==beforeValue||ledger.afterValue!==afterValue||ledger.delta!==afterValue-beforeValue'),'correction ledger must exactly mirror the correction value flow');
assert.ok(src.includes('ledger.beforeValue!==afterValue||ledger.afterValue!==beforeValue||ledger.delta!==beforeValue-afterValue'),'undo ledger must exactly reverse the correction value flow');
console.log('backup cross reference, activity score, and score ledger semantic integrity contract self-test passed');
