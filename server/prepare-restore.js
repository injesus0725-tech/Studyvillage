/* v1.11 restore preparation helper. Pure transformation/validation only; no DB writes. */
import { migrateStudyvillageBackup } from './backup-migrator.js';
import { validateStudyvillageBackupWithStars } from './backup-validator-with-stars.js';
import { validateAggregatePlayerRecords } from './aggregate-player-record-validator.js';

function removeOrphanScoreAuditRows(backup){
  const players=new Set((backup.players||[]).map(row=>String(row?.name||'')));
  const orphanIds=new Set((backup.scoreLedger||[]).filter(row=>!players.has(String(row?.player_name||''))).map(row=>Number(row?.id)));
  if(!orphanIds.size)return 0;
  backup.scoreLedger=(backup.scoreLedger||[]).filter(row=>!orphanIds.has(Number(row?.id)));
  backup.scoreAlertReviews=(backup.scoreAlertReviews||[]).filter(row=>!orphanIds.has(Number(row?.ledger_id)));
  backup.scoreCorrections=(backup.scoreCorrections||[]).filter(row=>players.has(String(row?.player_name||''))&&!orphanIds.has(Number(row?.ledger_id))&&!orphanIds.has(Number(row?.correction_ledger_id))&&!orphanIds.has(Number(row?.undo_ledger_id)));
  return orphanIds.size;
}

export function prepareStudyvillageRestore(input){
  const migrated=migrateStudyvillageBackup(input);
  if(!migrated.ok)return migrated;
  const removedOrphanScoreAuditRows=removeOrphanScoreAuditRows(migrated.backup);

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
    extraAttemptHistoryCount:validation.extraAttemptHistoryCount||0,
    removedOrphanScoreAuditRows
  };
}
