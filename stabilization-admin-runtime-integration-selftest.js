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

  result=await request('/api/admin/student-change-history',{token:adminToken});
  assert.equal(result.response.status,200,'teacher change history must load');
  assert.ok((result.data.changes||[]).some(row=>row.type==='xp-correction'),'XP correction must be audited');
  assert.ok((result.data.changes||[]).some(row=>row.type==='activity-record-correction'),'activity correction must be audited');

  console.log('stabilization admin runtime integration selftest passed');
} finally {
  if(server?.listening)await new Promise(resolve=>server.close(resolve));
  fs.rmSync(tempDir,{recursive:true,force:true});
}
