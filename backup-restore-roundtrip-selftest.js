import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import Database from 'better-sqlite3';

const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'studyvillage-restore-roundtrip-'));
const port=36000+(process.pid%1000),base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['server/server.js'],{cwd:process.cwd(),env:{...process.env,STUDYVILLAGE_DATA_DIR:dataDir,PORT:String(port)},stdio:['ignore','ignore','pipe']});
let serverError='';server.stderr.on('data',chunk=>{serverError+=String(chunk).slice(0,1200)});
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const request=async(route,options={})=>{const response=await fetch(base+route,{...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});return{status:response.status,data:await response.json()}};
try{
  let ready=false;for(let attempt=0;attempt<50;attempt++){try{if((await fetch(base+'/api/health')).ok){ready=true;break}}catch{}await wait(100)}
  assert.ok(ready,`temporary classroom server did not start: ${serverError}`);
  const login=await request('/api/login',{method:'POST',body:JSON.stringify({name:'복원점검학생',password:'1234'})});
  assert.equal(login.status,200);const studentHeaders={Authorization:`Bearer ${login.data.token}`};
  const equipped=await request('/api/player/me/equipment',{method:'POST',headers:studentHeaders,body:JSON.stringify({baseCharacter:'student-girl',equipment:{face:'face-round',expression:'expression-smile'}})});
  assert.equal(equipped.status,200);
  const admin=await request('/api/admin/local-session',{method:'POST'});assert.equal(admin.status,200);const adminHeaders={Authorization:`Bearer ${admin.data.token}`};
  const deletedLogin=await request('/api/login',{method:'POST',body:JSON.stringify({name:'삭제점검학생',password:'1234'})});assert.equal(deletedLogin.status,200);
  const liveDb=new Database(path.join(dataDir,'studyvillage.db'));liveDb.prepare('INSERT INTO activity_records(player_name,activity_id,attempts,best_score,last_score,total_score,updated_at) VALUES(?,?,?,?,?,?,?)').run('삭제점검학생','delete-check',1,100,100,100,new Date().toISOString());liveDb.close();
  assert.equal((await request(`/api/admin/player/${encodeURIComponent('삭제점검학생')}`,{method:'DELETE',headers:adminHeaders})).status,200);
  const backupResponse=await fetch(base+'/api/admin/backup',{headers:adminHeaders});assert.equal(backupResponse.status,200);const backup=await backupResponse.json();
  const savedEquipment=JSON.parse(backup.players.find(player=>player.name==='복원점검학생').equipment_json);
  assert.equal(savedEquipment.face,'face-round');assert.equal(savedEquipment.expression,'expression-smile');
  const preflight=await request('/api/admin/restore/preflight',{method:'POST',headers:adminHeaders,body:JSON.stringify(backup)});assert.equal(preflight.status,200);assert.equal(preflight.data.ok,true);
  const restored=await request('/api/admin/restore',{method:'POST',headers:adminHeaders,body:JSON.stringify(backup)});assert.equal(restored.status,200);assert.equal(restored.data.players,1);
  const relogin=await request('/api/login',{method:'POST',body:JSON.stringify({name:'복원점검학생',password:'1234'})});assert.equal(relogin.status,200);assert.equal(relogin.data.player.equipment.face,'face-round');assert.equal(relogin.data.player.equipment.expression,'expression-smile');
  console.log('backup restore authenticated roundtrip self-test passed');
}finally{
  server.kill('SIGTERM');await Promise.race([new Promise(resolve=>server.once('exit',resolve)),wait(1000)]);if(server.exitCode===null)server.kill('SIGKILL');fs.rmSync(dataDir,{recursive:true,force:true});
}
