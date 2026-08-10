/* v0.9.65 teacher backup restore guard.
   v0.9.64: reject malformed/non-Studyvillage backup JSON before admin.js sends it to the server.
   v0.9.65: reject unexpectedly large or structurally unreasonable backup files to avoid accidental browser/server overload. */
(()=>{
  const input=document.querySelector('#restore-file');
  if(!input)return;
  const MAX_FILE_BYTES=8*1024*1024;
  const MAX_PLAYERS=500,MAX_SETTINGS=500,MAX_ACTIVITIES=50000,MAX_ACTIVITY_RECORDS=50000,MAX_ERRORS=10000;
  const isArray=v=>Array.isArray(v);
  function reject(message){
    try{input.value=''}catch{}
    alert(`복원 파일을 사용할 수 없습니다.\n\n${message}\n\n기존 교실 데이터는 변경되지 않았습니다.`);
  }
  function validRowCounts(b){
    return b.players.length<=MAX_PLAYERS&&b.settings.length<=MAX_SETTINGS&&(!b.activities||b.activities.length<=MAX_ACTIVITIES)&&(!b.activityRecords||b.activityRecords.length<=MAX_ACTIVITY_RECORDS)&&(!b.errorReports||b.errorReports.length<=MAX_ERRORS);
  }
  async function inspect(e){
    const file=e.target.files?.[0];if(!file)return;
    if(file.size<=0){e.stopImmediatePropagation();reject('파일이 비어 있습니다.');return}
    if(file.size>MAX_FILE_BYTES){e.stopImmediatePropagation();reject(`백업 파일이 너무 큽니다. (${Math.ceil(file.size/1024/1024)}MB)\n8MB 이하의 Studyvillage 백업 파일을 선택해 주세요.`);return}
    let backup;
    try{backup=JSON.parse(await file.text())}catch{e.stopImmediatePropagation();reject('정상적인 JSON 백업 파일이 아닙니다.');return}
    const basic=backup&&backup.format==='studyvillage-backup'&&Number.isFinite(Number(backup.version))&&isArray(backup.players)&&isArray(backup.settings);
    const optional=(!backup.activities||isArray(backup.activities))&&(!backup.activityRecords||isArray(backup.activityRecords))&&(!backup.errorReports||isArray(backup.errorReports));
    if(!basic||!optional){e.stopImmediatePropagation();reject('Studyvillage 백업 형식이 아니거나 필수 데이터 구조가 손상되었습니다.');return}
    if(!validRowCounts(backup)){e.stopImmediatePropagation();reject('백업 안의 데이터 수가 정상적인 교실 사용 범위를 크게 벗어납니다.');return}
    const names=new Set();
    for(const p of backup.players){const name=String(p?.name||'').trim();if(!name||name.length>12||names.has(name)){e.stopImmediatePropagation();reject('학생 이름 정보가 비어 있거나 중복되어 있습니다.');return}names.add(name)}
  }
  input.addEventListener('change',inspect,true);
  window.StudyVillageAdminRestoreGuard={maxFileBytes:MAX_FILE_BYTES};
})();