import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';

const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'studyvillage-error-roundtrip-'));
const port=35000+(process.pid%1000);
const base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['server/server.js'],{
  cwd:process.cwd(),
  env:{...process.env,STUDYVILLAGE_DATA_DIR:dataDir,PORT:String(port)},
  stdio:['ignore','ignore','pipe']
});
let serverError='';
server.stderr.on('data',chunk=>{serverError+=String(chunk).slice(0,1000)});
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const request=async(route,options={})=>{
  const response=await fetch(base+route,{...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});
  return{status:response.status,data:await response.json()};
};
try{
  let ready=false;
  for(let attempt=0;attempt<40;attempt++){
    try{if((await fetch(base+'/api/health')).ok){ready=true;break}}catch{}
    await wait(100);
  }
  assert.ok(ready,`임시 교실 서버가 시작되지 않았습니다. ${serverError}`);
  const login=await request('/api/login',{method:'POST',body:JSON.stringify({name:'오류점검학생',password:'1234'})});
  assert.equal(login.status,200);
  assert.ok(login.data.token);
  const studentHeaders={Authorization:`Bearer ${login.data.token}`};
  const report={id:'v1-error-roundtrip-1',kind:'window-error',message:'점검 오류 Bearer secret-token',stack:'at safe-test',page:'/v1-audit',version:'1.9.0',online:true,mode:'classroom-server',userAgent:'roundtrip-selftest',extra:{status:500},recentEvents:[{type:'activity-complete'}],at:new Date().toISOString()};
  assert.equal((await request('/api/error-report',{method:'POST',headers:studentHeaders,body:JSON.stringify(report)})).status,200);
  assert.equal((await request('/api/error-report',{method:'POST',headers:studentHeaders,body:JSON.stringify(report)})).status,200);
  assert.equal((await request('/api/error-report',{method:'POST',body:JSON.stringify(report)})).status,401);
  const localAdmin=await request('/api/admin/local-session',{method:'POST'});
  assert.equal(localAdmin.status,200);
  const adminHeaders={Authorization:`Bearer ${localAdmin.data.token}`};
  const listed=await request('/api/admin/errors',{headers:adminHeaders});
  assert.equal(listed.status,200);
  assert.equal(listed.data.errors.length,1,'같은 오류 ID는 한 번만 저장되어야 합니다.');
  const saved=listed.data.errors[0];
  assert.equal(saved.playerName,'오류점검학생');
  assert.equal(saved.version,'1.9.0');
  assert.match(saved.groupKey,/^[a-f0-9]{64}$/);
  assert.match(saved.message,/\[REDACTED\]/);
  assert.ok(!saved.message.includes('secret-token'));
  assert.equal((await request('/api/admin/errors/retention',{headers:adminHeaders})).data.days,90);
  assert.equal((await request('/api/admin/runtime-errors',{headers:adminHeaders})).status,200);
  assert.equal((await request('/api/admin/errors',{method:'DELETE',headers:adminHeaders})).status,200);
  assert.equal((await request('/api/admin/errors',{headers:adminHeaders})).data.errors.length,0);
  console.log('error reporting authenticated roundtrip self-test passed');
}finally{
  server.kill('SIGTERM');
  await Promise.race([new Promise(resolve=>server.once('exit',resolve)),wait(1000)]);
  if(server.exitCode===null)server.kill('SIGKILL');
  fs.rmSync(dataDir,{recursive:true,force:true});
}
