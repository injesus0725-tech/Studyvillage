const fs=require('fs');
const assert=require('assert');
const validator=fs.readFileSync('server/aggregate-player-record-validator.js','utf8');
const prepare=fs.readFileSync('server/prepare-restore.js','utf8');
for(const token of [
  'attempts===0',
  'bestScore!==0||lastScore!==0||totalScore!==0',
  'bestScore<lastScore',
  'totalScore<bestScore',
  'totalScore>attempts*1000',
  "code:'invalid-player-score-relationship'"
])assert.ok(validator.includes(token),`aggregate player backup relationship guard missing: ${token}`);
assert.ok(prepare.includes("import { validateAggregatePlayerRecords } from './aggregate-player-record-validator.js'"),'restore preparation must import aggregate player validation');
assert.ok(prepare.includes('if(migrated.fromVersion>=9)'),'aggregate relationship validation must preserve v1-v8 restore compatibility');
assert.ok(prepare.includes('validateAggregatePlayerRecords(migrated.backup)'),'current-format restore must validate aggregate player relationships');
console.log('aggregate player backup relationship contract self-test passed');
