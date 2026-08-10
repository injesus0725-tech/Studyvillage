/* v0.9.73 backward-compatible Studyvillage backup migration.
   Older supported backups are normalized forward before validation/restore.
   Never mutates the original parsed backup object. */

export const CURRENT_BACKUP_VERSION=7;

const clone=value=>JSON.parse(JSON.stringify(value));
const baseEquipment='{}';

function normalizePlayer(player={}){
  return {
    ...player,
    total_score:Number(player.total_score)||0,
    attempts:Number(player.attempts)||0,
    best_score:Number(player.best_score)||0,
    last_score:Number(player.last_score)||0,
    login_count:Number(player.login_count)||0,
    last_login_at:player.last_login_at||null,
    xp:Number(player.xp)||0,
    base_character:player.base_character||'student-default',
    equipment_json:typeof player.equipment_json==='string'?player.equipment_json:baseEquipment,
    created_at:player.created_at||player.updated_at||new Date(0).toISOString(),
    updated_at:player.updated_at||player.created_at||new Date(0).toISOString()
  };
}

function normalizeBackupShape(backup){
  backup.players=Array.isArray(backup.players)?backup.players.map(normalizePlayer):backup.players;
  backup.settings=Array.isArray(backup.settings)?backup.settings:[];
  backup.activities=Array.isArray(backup.activities)?backup.activities:[];
  backup.activityRecords=Array.isArray(backup.activityRecords)?backup.activityRecords:[];
  backup.errorReports=Array.isArray(backup.errorReports)?backup.errorReports:[];
  return backup;
}

/*
  Migration registry. Add future migrations here instead of rewriting old backups.
  Each function receives the previous version and returns the next version.
  Historical versions 1~6 are normalized into the fields required by v7.
*/
const migrations={
  1:b=>({...normalizeBackupShape(b),version:2}),
  2:b=>({...normalizeBackupShape(b),version:3}),
  3:b=>({...normalizeBackupShape(b),version:4}),
  4:b=>({...normalizeBackupShape(b),version:5}),
  5:b=>({...normalizeBackupShape(b),version:6}),
  6:b=>({...normalizeBackupShape(b),version:7})
};

export function migrateStudyvillageBackup(input){
  if(!input||input.format!=='studyvillage-backup')return{ok:false,code:'invalid-format',message:'Studyvillage 백업 형식이 아닙니다.'};
  let backup=clone(input),fromVersion=Number(backup.version);
  if(!Number.isInteger(fromVersion)||fromVersion<1)return{ok:false,code:'invalid-version',message:'백업 버전 정보가 올바르지 않습니다.'};
  if(fromVersion>CURRENT_BACKUP_VERSION)return{ok:false,code:'future-version',message:`현재 프로그램보다 새로운 백업입니다. 지원 버전은 ${CURRENT_BACKUP_VERSION}까지입니다.`};
  const originalVersion=fromVersion;
  while(fromVersion<CURRENT_BACKUP_VERSION){const migrate=migrations[fromVersion];if(typeof migrate!=='function')return{ok:false,code:'missing-migration',message:`백업 v${fromVersion}을(를) 현재 형식으로 변환하는 규칙이 없습니다.`};backup=migrate(backup);fromVersion=Number(backup.version)}
  backup=normalizeBackupShape(backup);backup.version=CURRENT_BACKUP_VERSION;
  return{ok:true,backup,fromVersion:originalVersion,toVersion:CURRENT_BACKUP_VERSION,migrated:originalVersion!==CURRENT_BACKUP_VERSION};
}
