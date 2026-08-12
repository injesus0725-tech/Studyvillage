const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-migrator.js','utf8');
for(const token of [
  "code:'missing-migration'",
  "code:'broken-migration'",
  "code:'nondeterministic-migration'",
  "code:'migration-mutates-input'",
  "code:'migration-chain-invalid'",
  'stable(first)!==stable(second)',
  'const chainStatus=verifyMigrationChain()',
  'while(fromVersion<CURRENT_BACKUP_VERSION)'
])assert.ok(src.includes(token),`backup migration safety guard missing: ${token}`);
assert.ok(src.includes('const clone=value=>JSON.parse(JSON.stringify(value))'),'migration must work on a clone');
assert.ok(src.includes('backup=normalizeBackupShape(backup);backup.version=CURRENT_BACKUP_VERSION'),'final migrated shape/version must be normalized');
console.log('backup migration determinism contract self-test passed');
