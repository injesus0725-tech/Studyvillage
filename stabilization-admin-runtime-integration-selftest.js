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
async function request(url,{method='GET',token,body}={}){const response=await fetch(`${base}${url}`,{method,headers:body===undefined?(token?{Authorization:`Bearer ${token}`}:{ }):jsonHeaders(token),...(body===undefined?{}:{body:JSON.stringify(body)})});const data=await response.json().catch(()=>({}));return{response,data}}
let server;
try{
  const mod=await import(`./server/server.js?stabilization-admin-runtime=${Date.now()}`);server=mod.startClassroomServer();await new Promise((resolve,reject)=>{if(server.listening)return resolve();server.once('listening',resolve);server.once('error',reject)});
  const studentLogin=await request('/api/login',{method:'POST',body:{name:'안정화학생',password:'1234'}});assert.equal(studentLogin.response.status,200);let studentToken=studentLogin.data.token;assert.ok(studentToken);
  const adminLogin=await request('/api/admin/login',{method:'POST',body:{password:'teacher1234'}});assert.equal(adminLogin.response.status,200);let adminToken=adminLogin.data.token;assert.ok(adminToken);
  let result=await request('/api/admin/stars/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D',{token:adminToken});assert.equal(result.data.balance,0);
  result=await request('/api/admin/stars/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/adjust',{method:'POST',token:adminToken,body:{delta:5,reason:'안정화 지급 확인'}});assert.equal(result.data.afterValue,5);
  result=await request('/api/admin/stars/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/adjust',{method:'POST',token:adminToken,body:{delta:-2,reason:'안정화 차감 확인'}});assert.equal(result.data.afterValue,3);
  result=await request('/api/admin/player/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/xp',{method:'POST',token:adminToken,body:{xp:600,reason:'안정화 XP 확인'}});assert.equal(result.data.afterXp,600);
  result=await request('/api/player/me/activity',{method:'POST',token:studentToken,body:{activityId:'vocabulary',score:100,submissionId:'admin-runtime-vocabulary-0001'}});assert.equal(result.response.status,200);assert.equal(result.data.activityStars,2);assert.equal(result.data.xp,640,'perfect vocabulary completion must add 40 XP after teacher correction baseline');
  result=await request('/api/admin/player/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/activity-records/vocabulary',{method:'POST',token:adminToken,body:{attempts:2,bestScore:100,lastScore:80,totalScore:180,reason:'안정화 기록 확인'}});assert.equal(result.response.status,200);
  result=await request('/api/admin/activity-attempt-policies',{token:adminToken});const policies={...(result.data.policies||{}),'exploration-forest-riddle':{mode:'limited',limit:2,xpMode:'first-completion'}};result=await request('/api/admin/activity-attempt-policies',{method:'PUT',token:adminToken,body:{policies}});assert.equal(result.data.policies?.['exploration-forest-riddle']?.limit,2);
  result=await request('/api/admin/activity-attempt-extra/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/exploration-forest-riddle/grant',{method:'POST',token:adminToken,body:{amount:1}});assert.equal(result.data.extraAttempts,1);
  result=await request('/api/admin/player/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/custom-title',{method:'POST',token:adminToken,body:{title:'안정화 용사',reason:'칭호 수정 검증'}});assert.equal(result.response.status,200);
  result=await request('/api/admin/activity-state/riddle-demo',{method:'PUT',token:adminToken,body:{name:'도전관 · 수수께끼',open:false,message:'안정화 점검 중'}});assert.equal(result.data.activity?.open,false);
  result=await request('/api/admin/player/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/reset-password',{method:'POST',token:adminToken,body:{password:'5678'}});assert.equal(result.response.status,200);
  const relogin=await request('/api/login',{method:'POST',body:{name:'안정화학생',password:'5678'}});assert.equal(relogin.response.status,200);studentToken=relogin.data.token;
  result=await request('/api/admin/player/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D/rename',{method:'POST',token:adminToken,body:{newName:'안정화학생2',reason:'이름 수정 검증'}});assert.equal(result.response.status,200);
  result=await request('/api/admin/stars/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D2',{token:adminToken});assert.equal(result.data.balance,5,'rename must preserve stars');
  const backup=await request('/api/admin/backup',{token:adminToken});assert.equal(backup.response.status,200);assert.equal(backup.data.format,'studyvillage-backup');
  const mirror=(backup.data.settings||[]).find(row=>row.key===`compat:stars:${encodeURIComponent('안정화학생2')}`);assert.ok(mirror,'backup must contain renamed student star mirror');assert.equal(JSON.parse(mirror.value).balance,5,'backup star mirror must preserve balance');
  const backedUpPlayer=(backup.data.players||[]).find(row=>row.name==='안정화학생2');assert.ok(backedUpPlayer,'backup must contain renamed player');assert.equal(backedUpPlayer.xp,640,'backup must capture teacher-corrected plus earned XP');
  result=await request('/api/admin/activity-state/riddle-demo',{method:'PUT',token:adminToken,body:{name:'도전관 · 수수께끼',open:true,message:'백업 이후 임시 변경'}});assert.equal(result.data.activity?.open,true);
  result=await request('/api/admin/restore',{method:'POST',token:adminToken,body:backup.data});assert.equal(result.response.status,200);assert.equal(result.data.ok,true);assert.ok(Number(result.data.restoredStarMirrors)>=1,'restore must materialize star mirrors before success response');
  const adminAfterRestore=await request('/api/admin/login',{method:'POST',body:{password:'teacher1234'}});assert.equal(adminAfterRestore.response.status,200);adminToken=adminAfterRestore.data.token;
  result=await request('/api/admin/stars/%EC%95%88%EC%A0%95%ED%99%94%ED%95%99%EC%83%9D2',{token:adminToken});assert.equal(result.data.balance,5,'backup/restore must preserve star balance');
  result=await request('/api/admin/players',{token:adminToken});const restored=(result.data.players||[]).find(row=>row.name==='안정화학생2');assert.ok(restored);assert.equal(restored.xp,640,'backup/restore must preserve corrected plus earned XP');
  result=await request('/api/activity-state/riddle-demo');assert.equal(result.data.activity?.open,false,'backup/restore must preserve activity state');
  console.log('stabilization admin runtime integration selftest passed');
}finally{if(server?.listening)await new Promise(resolve=>server.close(resolve));fs.rmSync(tempDir,{recursive:true,force:true})}
