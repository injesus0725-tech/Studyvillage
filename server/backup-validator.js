/* v0.9.67 server-side Studyvillage backup validator.
   This module is intentionally isolated from server.js first, so restore validation can be tested and integrated without rewriting the core classroom server in one risky step. */

const LIMITS={players:500,settings:500,activities:50000,activityRecords:50000,errorReports:10000};
const finite=v=>Number.isFinite(Number(v));
const text=(v,max)=>typeof v==='string'&&v.length<=max;

function fail(code,message){return{ok:false,code,message}}

export function validateStudyvillageBackup(backup){
  if(!backup||backup.format!=='studyvillage-backup')return fail('invalid-format','Studyvillage 백업 형식이 아닙니다.');
  if(!finite(backup.version))return fail('invalid-version','백업 버전 정보가 올바르지 않습니다.');
  if(!Array.isArray(backup.players)||!Array.isArray(backup.settings))return fail('missing-required-data','학생 또는 설정 데이터가 없습니다.');
  if(backup.activities&&!Array.isArray(backup.activities))return fail('invalid-activities','최근 활동 데이터 형식이 올바르지 않습니다.');
  if(backup.activityRecords&&!Array.isArray(backup.activityRecords))return fail('invalid-activity-records','학습 활동 기록 형식이 올바르지 않습니다.');
  if(backup.errorReports&&!Array.isArray(backup.errorReports))return fail('invalid-error-reports','오류 기록 형식이 올바르지 않습니다.');

  if(backup.players.length>LIMITS.players||backup.settings.length>LIMITS.settings||(backup.activities?.length||0)>LIMITS.activities||(backup.activityRecords?.length||0)>LIMITS.activityRecords||(backup.errorReports?.length||0)>LIMITS.errorReports)return fail('too-many-records','백업 데이터 수가 정상 범위를 벗어납니다.');

  const names=new Set();
  for(const p of backup.players){
    const name=String(p?.name||'').trim();
    if(!name||name.length>12||names.has(name))return fail('invalid-player-name','학생 이름이 비어 있거나 중복되어 있습니다.');
    if(!text(p?.password_hash,300)||!text(p?.password_salt,200))return fail('invalid-player-auth','학생 인증 정보가 손상되었습니다.');
    for(const value of [p?.total_score??0,p?.attempts??0,p?.best_score??0,p?.last_score??0,p?.login_count??0,p?.xp??0])if(!finite(value))return fail('invalid-player-number','학생 점수 또는 XP 정보가 손상되었습니다.');
    if(!text(p?.created_at||'',80)||!text(p?.updated_at||'',80))return fail('invalid-player-date','학생 날짜 정보가 손상되었습니다.');
    names.add(name);
  }

  const settingKeys=new Set();
  for(const s of backup.settings){
    const key=String(s?.key||'');
    if(!key||key.length>200||settingKeys.has(key)||typeof s?.value!=='string')return fail('invalid-setting','설정 정보가 비어 있거나 중복 또는 손상되었습니다.');
    settingKeys.add(key);
  }

  for(const row of backup.activities||[]){
    if(!row||!names.has(String(row.player_name||''))||!text(String(row.type||''),100)||!text(String(row.created_at||''),80))return fail('invalid-activity-log','최근 활동 기록에 존재하지 않는 학생 또는 손상된 항목이 있습니다.');
  }

  const activityKeys=new Set();
  for(const row of backup.activityRecords||[]){
    const player=String(row?.player_name||''),activityId=String(row?.activity_id||''),key=`${player}\u0000${activityId}`;
    if(!names.has(player)||!/^[a-z0-9-]{1,40}$/.test(activityId)||activityKeys.has(key))return fail('invalid-activity-record','학습 활동 기록에 존재하지 않는 학생, 잘못된 활동 ID 또는 중복 항목이 있습니다.');
    for(const value of [row?.attempts,row?.best_score,row?.last_score,row?.total_score])if(!finite(value))return fail('invalid-activity-score','학습 활동 점수 정보가 손상되었습니다.');
    activityKeys.add(key);
  }

  const reportIds=new Set();
  for(const row of backup.errorReports||[]){
    const reportId=String(row?.report_id||'');
    if(!reportId||reportId.length>100||reportIds.has(reportId)||row?.player_name&&!names.has(String(row.player_name)))return fail('invalid-error-report','오류 기록에 존재하지 않는 학생, 빈 ID 또는 중복 항목이 있습니다.');
    reportIds.add(reportId);
  }

  return{ok:true,counts:{players:backup.players.length,settings:backup.settings.length,activities:backup.activities?.length||0,activityRecords:backup.activityRecords?.length||0,errorReports:backup.errorReports?.length||0}};
}

export const backupValidationLimits=Object.freeze({...LIMITS});