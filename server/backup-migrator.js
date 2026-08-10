/* v0.9.76 backward-compatible Studyvillage backup migration.
   Older supported backups gain only fields that did not exist yet; suspicious existing values are preserved so validation can reject them.
   Never mutates the original parsed backup object. */

export const CURRENT_BACKUP_VERSION=7;

const clone=value=>JSON.parse(JSON.stringify(value));
const has=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);

function normalizePlayer(player={}){
  const out={...player};
  if(!has(out,'total_score'))out.total_score=0;
  if(!has(out,'attempts'))out.attempts=0;
  if(!has(out,'best_score'))out.best_score=0;
  if(!has(out,'last_score'))out.last_score=0;
  if(!has(out,'login_count'))out.login_count=0;
  if(!has(out,'last_login_at'))out.last_login_at=null;
  if(!has(out,'xp'))out.xp=0;
  if(!has(out,'base_character'))out.base_character='student-default';
  if(!has(out,'equipment_json'))out.equipment_json='{}';
  if(!has(out,'created_at')&&has(out,'updated_at'))out.created_at=out.updated_at;
  if(!has(out,'updated_at')&&has(out,'created_at'))out.updated_at=out.created_at;
  return out;
}

function normalizeBackupShape(backup){
  backup.players=Array.isArray(backup.players)?backup.players.map(normalizePlayer):backup.players;
  backup.settings=Array.isArray(backup.settings)?backup.settings:[];
  backup.activities=Array.isArray(backup.activities)?backup.activities:[];
  backup.activityRecords=Array.isArray(backup.activityRecords)?backup.activityRecords:[];
  backup.errorReports=Array.isArray(backup.errorReports)?backup.errorReports:[];
  return backup;
}

/* Add future one-version-at-a-time migrations here. Never rewrite or delete old rules. */
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
