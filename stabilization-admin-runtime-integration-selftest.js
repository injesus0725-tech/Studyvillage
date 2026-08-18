import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tempDir=fs.mkdtempSync(path.join(os.tmpdir(),'studyvillage-admin-runtime-'));
const port=39000+Math.floor(Math.random()*1000);
process.env.STUDYVILLAGE_DATA_DIR=tempDir;
process.env.STUDYVILLAGE_EMBEDDED='1';
process.env.PORT=String(port);

const base=`http://127.0.0.1:${port}`;
const jsonHeaders=token=>({...(token?{Authorization:`Bearer ${token}`}:{ }),'Content-Type':'application/json'});
async function request(url,{method='GET',token,body}={}){
  const response=await fetch(`${base}${url}`,{method,headers:body===undefined?(token?{Authorization:`Bearer ${token}`}:{ }):jsonHeaders(token),...(body===undefined?{}:{body:JSON.stringify(body)})});
  const data=await response.json().catch(()=>({}));
  return{response,data};
}

let server;
try{
  const mod=await import(`./server/server.js?stabilization-admin-runtime=${Date.now()}`);
  server=mod.startClassroomServer();
  await new Promise((resolve,reject)=>{if(server.listening)return resolve();server.once('listening',resolve);server.once('error',reject)});

  const studentLogin=await request('/api/login',{method:'POST',body:{name:'안정화학생',password:'1234'}});
  assert.equal(studentLogin.response.status,200,'student login must succeed');
  assert.equal(studentLogin.data.ok,true,'student login payload must be ok');
  const studentToken=studentLogin.data.token;
  assert.ok(studentToken,'student token must be returned');

  const adminLogin=await request('/api/admin/login',{method:'POST',body:{password:'teacher1234'}});
  assert.equal(adminLogin.response.status,200,'admin login must succeed');
  assert.equal(adminLogin.data.ok,true,'admin login payload must be ok');
  const adminToken=adminLogin.data.token;
  assert.ok(adminToken,'admin token must be returned');

  let result=await request('/api/admin/stars/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D',{token:adminToken});
  assert.equal(result.response.status,200,'teacher star read must work');
  assert.equal(result.data.balance,0,'new student starts with 0 stars');

  result=await request('/api/admin/stars/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/adjust',{method:'POST',token:adminToken,body:{delta:5,reason:'안정화 지급 확인'}});
  assert.equal(result.response.status,200,'teacher star grant must work');
  assert.equal(result.data.afterValue,5,'star grant must persist expected balance');

  result=await request('/api/admin/stars/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/adjust',{method:'POST',token:adminToken,body:{delta:-2,reason:'안정화 차감 확인'}});
  assert.equal(result.response.status,200,'teacher star subtraction must work');
  assert.equal(result.data.afterValue,3,'star subtraction must persist expected balance');

  result=await request('/api/admin/stars/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D',{token:adminToken});
  assert.equal(result.data.balance,3,'star reread must reflect teacher writes');
  assert.ok((result.data.entries||[]).some(row=>Number(row.delta)===5),'star ledger must contain grant');
  assert.ok((result.data.entries||[]).some(row=>Number(row.delta)===-2),'star ledger must contain subtraction');

  result=await request('/api/admin/player/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/xp',{method:'POST',token:adminToken,body:{xp:600,reason:'안정화 XP 확인'}});
  assert.equal(result.response.status,200,'teacher XP correction must work');
  assert.equal(result.data.afterXp,600,'XP correction response must show persisted value');

  result=await request('/api/admin/players',{token:adminToken});
  const student=(result.data.players||[]).find(row=>row.name==='안정화학생');
  assert.ok(student,'student must remain listed');
  assert.equal(student.xp,600,'admin player reread must reflect XP correction');

  result=await request('/api/player/me/activity',{method:'POST',token:studentToken,body:{activityId:'vocabulary',score:100}});
  assert.equal(result.response.status,200,'student activity save must work before teacher correction');

  result=await request('/api/admin/player/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/activity-records',{token:adminToken});
  const vocabulary=(result.data.records||[]).find(row=>row.activityId==='vocabulary');
  assert.ok(vocabulary,'saved activity record must be visible to teacher');

  result=await request('/api/admin/player/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/activity-records/vocabulary',{method:'POST',token:adminToken,body:{attempts:2,bestScore:100,lastScore:80,totalScore:180,reason:'안정화 기록 확인'}});
  assert.equal(result.response.status,200,'teacher activity correction must work');
  assert.deepEqual({attempts:result.data.record.attempts,bestScore:result.data.record.bestScore,lastScore:result.data.record.lastScore,totalScore:result.data.record.totalScore},{attempts:2,bestScore:100,lastScore:80,totalScore:180},'activity correction must persist exact values');

  result=await request('/api/admin/activity-attempt-policies',{token:adminToken});
  assert.equal(result.response.status,200,'teacher attempt policies must load');
  const policies={...(result.data.policies||{}),'exploration-forest-riddle':{mode:'limited',limit:2,xpMode:'first-completion'}};
  result=await request('/api/admin/activity-attempt-policies',{method:'PUT',token:adminToken,body:{policies}});
  assert.equal(result.response.status,200,'teacher attempt policy save must work');
  assert.equal(result.data.policies?.['exploration-forest-riddle']?.limit,2,'saved exploration limit must reread as 2');

  result=await request('/api/player/me/activity-attempt-status/exploration-forest-riddle',{token:studentToken});
  assert.equal(result.response.status,200,'student exploration attempt status must work');
  assert.equal(result.data.allowed,true,'fresh limited exploration must be allowed');
  assert.equal(result.data.remaining,2,'fresh limited exploration must show two remaining attempts');

  result=await request('/api/admin/activity-attempt-extra/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/exploration-forest-riddle/grant',{method:'POST',token:adminToken,body:{amount:1}});
  assert.equal(result.response.status,200,'teacher extra attempt grant must work');
  assert.equal(result.data.extraAttempts,1,'extra attempt grant must persist');

  result=await request('/api/player/me/activity-attempt-status/exploration-forest-riddle',{token:studentToken});
  assert.equal(result.data.remaining,3,'student remaining attempts must include teacher extra grant');

  result=await request('/api/admin/player/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/custom-title',{method:'POST',token:adminToken,body:{title:'안정화 용사',reason:'칭호 수정 검증'}});
  assert.equal(result.response.status,200,'teacher title correction must work');
  assert.equal(result.data.ok,true,'teacher title correction payload must be ok');

  result=await request('/api/admin/activity-state/riddle-demo',{method:'PUT',token:adminToken,body:{name:'도전관 · 수수께끼',open:false,message:'안정화 점검 중'}});
  assert.equal(result.response.status,200,'teacher activity close must work');
  assert.equal(result.data.activity?.open,false,'teacher activity close must persist');
  result=await request('/api/activity-state/riddle-demo');
  assert.equal(result.response.status,200,'student activity-state read must work');
  assert.equal(result.data.activity?.open,false,'student must observe teacher-closed activity');

  result=await request('/api/admin/player/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/reset-password',{method:'POST',token:adminToken,body:{password:'5678'}});
  assert.equal(result.response.status,200,'teacher password reset must work');
  result=await request('/api/player/me',{token:studentToken});
  assert.equal(result.response.status,401,'password reset must revoke the existing student session');
  result=await request('/api/login',{method:'POST',body:{name:'안정화학생',password:'1234'}});
  assert.equal(result.response.status,401,'old student password must stop working');
  const relogin=await request('/api/login',{method:'POST',body:{name:'안정화학생',password:'5678'}});
  assert.equal(relogin.response.status,200,'new student password must work');
  assert.ok(relogin.data.token,'new password login must return a session');

  result=await request('/api/admin/player/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/rename',{method:'POST',token:adminToken,body:{newName:'안정화학생2',reason:'이름 수정 검증'}});
  assert.equal(result.response.status,200,'teacher student rename must work');
  assert.equal(result.data.newName,'안정화학생2','rename response must show the new student name');
  result=await request('/api/admin/players',{token:adminToken});
  assert.ok((result.data.players||[]).some(row=>row.name==='안정화학생2'),'renamed student must appear in admin players');
  assert.ok(!(result.data.players||[]).some(row=>row.name==='안정화학생'),'old student name must disappear after rename');
  const renamedLogin=await request('/api/login',{method:'POST',body:{name:'안정화학생2',password:'5678'}});
  assert.equal(renamedLogin.response.status,200,'renamed student must log in with the reset password');

  result=await request('/api/admin/stars/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D2',{token:adminToken});
  assert.equal(result.response.status,200,'star ledger must move with renamed student');
  assert.equal(result.data.balance,3,'renamed student must preserve star balance');

  result=await request('/api/admin/student-change-history',{token:adminToken});
  assert.equal(result.response.status,200,'teacher change history must load');
  assert.ok((result.data.changes||[]).some(row=>row.type==='xp-correction'),'XP correction must be audited');
  assert.ok((result.data.changes||[]).some(row=>row.type==='activity-record-correction'),'activity correction must be audited');
  assert.ok((result.data.changes||[]).some(row=>row.type==='teacher-title-correction'),'title correction must be audited');
  assert.ok((result.data.changes||[]).some(row=>row.type==='account-renamed'),'rename must be audited');

  const backup=await request('/api/admin/backup',{token:adminToken});
  assert.equal(backup.response.status,200,'teacher backup must work');
  assert.equal(backup.data.format,'studyvillage-backup','backup payload must have the expected format');
  assert.ok((backup.data.players||[]).some(row=>row.name==='안정화학생2'),'backup must contain renamed student');

  result=await request('/api/admin/activity-state/riddle-demo',{method:'PUT',token:adminToken,body:{name:'도전관 · 수수께끼',open:true,message:'백업 이후 임시 변경'}});
  assert.equal(result.response.status,200,'activity must be mutable before restore test');
  result=await request('/api/activity-state/riddle-demo');
  assert.equal(result.data.activity?.open,true,'pre-restore mutation must be visible');

  result=await request('/api/admin/restore',{method:'POST',token:adminToken,body:backup.data});
  assert.equal(result.response.status,200,'teacher restore must work');
  assert.equal(result.data.ok,true,'restore response must be ok');

  result=await request('/api/activity-state/riddle-demo');
  assert.equal(result.data.activity?.open,false,'restore must recover the backed-up activity closed state');

  const adminAfterRestore=await request('/api/admin/login',{method:'POST',body:{password:'teacher1234'}});
  assert.equal(adminAfterRestore.response.status,200,'admin must log in again after restore clears sessions');
  result=await request('/api/admin/stars/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D2',{token:adminAfterRestore.data.token});
  assert.equal(result.response.status,200,'restored renamed student star read must work');
  assert.equal(result.data.balance,3,'backup/restore must preserve teacher-adjusted star balance through the compatibility mirror');
  result=await request('/api/admin/players',{token:adminAfterRestore.data.token});
  const restoredStudent=(result.data.players||[]).find(row=>row.name==='안정화학생2');
  assert.ok(restoredStudent,'backup/restore must preserve renamed student');
  assert.equal(restoredStudent.xp,600,'backup/restore must preserve teacher-corrected XP');

  console.log('stabilization admin runtime integration selftest passed');
} finally {
  if(server?.listening)await new Promise(resolve=>server.close(resolve));
  fs.rmSync(tempDir,{recursive:true,force:true});
}
