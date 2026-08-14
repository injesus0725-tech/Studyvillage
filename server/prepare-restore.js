/* v1.11 restore preparation helper. Pure transformation/validation only; no DB writes. */
import { migrateStudyvillageBackup } from './backup-migrator.js';
import { validateStudyvillageBackupWithStars } from './backup-validator-with-stars.js';
import { validateAggregatePlayerRecords } from './aggregate-player-record-validator.js';

export function prepareStudyvillageRestore(input){
  const migrated=migrateStudyvillageBackup(input);
  if(!migrated.ok)return migrated;

  const validation=validateStudyvillageBackupWithStars(migrated.backup);
  if(!validation.ok)return validation;

  // Aggregate record relationship checks became an enforced write invariant in the current backup format.
  // Preserve restore compatibility for older backups that predate that invariant.
  if(migrated.fromVersion>=9){
    const aggregateValidation=validateAggregatePlayerRecords(migrated.backup);
    if(!aggregateValidation.ok)return aggregateValidation;
  }

  return{
    ok:true,
    backup:migrated.backup,
    fromVersion:migrated.fromVersion,
    toVersion:migrated.toVersion,
    migrated:migrated.migrated,
    counts:validation.counts,
    starMirrorCount:validation.starMirrorCount||0,
    extraAttemptSettingCount:validation.extraAttemptSettingCount||0,
    extraAttemptHistoryCount:validation.extraAttemptHistoryCount||0
  };
}
