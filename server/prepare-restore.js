/* v1.9 restore preparation helper. Pure transformation/validation only; no DB writes. */
import { migrateStudyvillageBackup } from './backup-migrator.js';
import { validateStudyvillageBackupWithStars } from './backup-validator-with-stars.js';

export function prepareStudyvillageRestore(input){
  const migrated=migrateStudyvillageBackup(input);
  if(!migrated.ok)return migrated;

  const validation=validateStudyvillageBackupWithStars(migrated.backup);
  if(!validation.ok)return validation;

  return{
    ok:true,
    backup:migrated.backup,
    fromVersion:migrated.fromVersion,
    toVersion:migrated.toVersion,
    migrated:migrated.migrated,
    counts:validation.counts,
    starMirrorCount:validation.starMirrorCount||0
  };
}
