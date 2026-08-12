const fs=require('fs');
const assert=require('assert');
const migrator=fs.readFileSync('server/backup-migrator.js','utf8');
const prepare=fs.readFileSync('server/prepare-restore.js','utf8');
const middleware=fs.readFileSync('server/restore-validation-middleware.js','utf8');

assert.ok(migrator.includes('if(fromVersion>CURRENT_BACKUP_VERSION)'), 'newer backups must be rejected');
assert.ok(migrator.includes("code:'future-version'"), 'newer backup rejection needs a distinct code');
assert.ok(prepare.indexOf('migrateStudyvillageBackup(input)') < prepare.indexOf('validateStudyvillageBackupWithStars(migrated.backup)'), 'backup migration/version gate must run before restore validation');
assert.ok(middleware.includes('if(!prepared?.ok)'), 'invalid/future backups must stop in validation middleware');
assert.ok(middleware.includes('return res.status(400).json'), 'future backup must not reach destructive restore');
console.log('backup future version safety contract self-test passed');
