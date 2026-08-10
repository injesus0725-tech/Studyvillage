/* v0.9.82 backward-compatible Studyvillage backup migration.
   Older supported backups gain only fields that did not exist yet; suspicious existing values are preserved so validation can reject them.
   Migration output is deterministic and startup verification checks continuity plus repeatability.
   Never mutates the original parsed backup object. */

export const CURRENT_BACKUP_VERSION=7;

const clone=value=>JSON.parse(JSON.stringify(value));
const has=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
const LEGACY_EPOCH='1970-01-01T00:00:00.000Z';
const stable=value=>JSON.stringify(value);

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
  if(!has(out,'created_at'))out.created_at=has(out,'updated_at')?out.updated_at:LEGACY_EPOCH;
  if(!has(out,'updated_at'))out.updated_at=has(out,'created_at')?out.created_at:LEGACY_EPOCH;
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

export function verifyMigrationChain(){
  for(let version=1;version<CURRENT_BACKUP_VERSION;version++){
    const migrate=migrations[version];
    if(typeof migrate!=='function')return{ok:false,code:'missing-migration',version,message:`백업 v${version} → v${version+1} 변환 규칙이 없습니다.`};
    try{
      const probe={format:'studyvillage-backup',version,players:[{name:'검증',password_hash:'x',password_salt:'y'}],settings:[]};
      const first=migrate(clone(probe)),second=migrate(clone(probe));
      if(Number(first?.version)!==version+1)return{ok:false,code:'broken-migration',version,message:`백업 v${version} 변환 규칙이 정확히 v${version+1}로 진행하지 않습니다.`};
      if(stable(first)!==stable(second))return{ok:false,code:'nondeterministic-migration',version,message:`백업 v${version} 변환 결과가 실행할 때마다 달라집니다.`};
      if(stable(probe)!==stable({format:'studyvillage-backup',version,players:[{name:'검증',password_hash:'x',password_salt:'y'}],settings:[]}))return{ok:false,code:'migration-mutates-input',version,message:`백업 v${version} 변환 규칙이 원본 데이터를 변경합니다.`};
    }catch(error){return{ok:false,code:'migration-error',version,message:`백업 v${version} 변환 규칙 검사 중 오류가 발생했습니다: ${String(error?.message||error).slice(0,160)}`}}
  }
  return{ok:true,currentVersion:CURRENT_BACKUP_VERSION,steps:CURRENT_BACKUP_VERSION-1};
}

const chainStatus=verifyMigrationChain();
if(!chainStatus.ok)console.error('[Studyvillage] backup migration chain invalid:',chainStatus.message);

export function migrateStudyvillageBackup(input){
  if(!chainStatus.ok)return{ok:false,code:'migration-chain-invalid',message:'이 버전의 백업 변환 규칙에 문제가 있어 안전을 위해 복원을 중단했습니다.'};
  if(!input||input.format!=='studyvillage-backup')return{ok:false,code:'invalid-format',message:'Studyvillage 백업 형식이 아닙니다.'};
  let backup=clone(input),fromVersion=Number(backup.version);
  if(!Number.isInteger(fromVersion)||fromVersion<1)return{ok:false,code:'invalid-version',message:'백업 버전 정보가 올바르지 않습니다.'};
  if(fromVersion>CURRENT_BACKUP_VERSION)return{ok:false,code:'future-version',message:`현재 프로그램보다 새로운 백업입니다. 지원 버전은 ${CURRENT_BACKUP_VERSION}까지입니다.`};
  const originalVersion=fromVersion;
  while(fromVersion<CURRENT_BACKUP_VERSION){const migrate=migrations[fromVersion];backup=migrate(backup);const nextVersion=Number(backup?.version);if(nextVersion!==fromVersion+1)return{ok:false,code:'broken-migration',message:`백업 v${fromVersion} 변환이 올바르게 진행되지 않아 복원을 중단했습니다.`};fromVersion=nextVersion}
  backup=normalizeBackupShape(backup);backup.version=CURRENT_BACKUP_VERSION;
  return{ok:true,backup,fromVersion:originalVersion,toVersion:CURRENT_BACKUP_VERSION,migrated:originalVersion!==CURRENT_BACKUP_VERSION};
}
