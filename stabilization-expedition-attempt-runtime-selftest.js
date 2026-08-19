import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tempDir=fs.mkdtempSync(path.join(os.tmpdir(),'studyvillage-exp-attempt-'));
const port=40000+Math.floor(Math.random()*1000);
process.env.STUDYVILLAGE_DATA_DIR=tempDir;
process.env.STUDYVILLAGE_EMBEDDED='1';
process.env.PORT=String(port);
const base=`http://127.0.0.1:${port}`;
const req=async(url,{method='GET',token,body}={})=>{const r=await fetch(base+url,{method,headers:{...(token?{Authorization:`Bearer ${token}`}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});return{r,d:await r.json().catch(()=>({}))}};
let server;
try{
  const mod=await import(`./server/server.js?exp-attempt=${Date.now()}`);server=mod.startClassroomServer();
  await new Promise((resolve,reject)=>{if(server.listening)return resolve();server.once('listening',resolve);server.once('error',reject)});
  let x=await req('/api/login',{method:'POST',body:{name:'탐험검증학생',password:'1234'}});assert.equal(x.r.status,200);const student=x.d.token;
  x=await req('/api/admin/login',{method:'POST',body:{password:'teacher1234'}});assert.equal(x.r.status,200);const admin=x.d.token;
  for(const id of ['exploration-forest-riddle','exploration-mountain-riddle']){
    x=await req(`/api/player/me/activity-attempt-status/${id}`);assert.equal(x.r.status,401,`${id} must require a student session`);
    x=await req(`/api/player/me/activity-attempt-status/${id}`,{token:student});assert.equal(x.r.status,200,`${id} default status must load`);assert.equal(x.d.ok,true);assert.equal(x.d.allowed,true,`${id} must default to allowed`);assert.equal(x.d.remaining,null,`${id} must default to unlimited before teacher policy`);
  }
  x=await req('/api/admin/activity-attempt-policies',{token:admin});assert.equal(x.r.status,200);const policies={...x.d.policies,'exploration-forest-riddle':{mode:'limited',limit:2,xpMode:'first-completion'},'exploration-mountain-riddle':{mode:'limited',limit:3,xpMode:'first-completion'}};
  x=await req('/api/admin/activity-attempt-policies',{method:'PUT',token:admin,body:{policies}});assert.equal(x.r.status,200);
  x=await req('/api/player/me/activity-attempt-status/exploration-forest-riddle',{token:student});assert.equal(x.d.remaining,2);assert.equal(x.d.policyId,'exploration-forest-riddle');
  x=await req('/api/player/me/activity-attempt-status/exploration-mountain-riddle',{token:student});assert.equal(x.d.remaining,3);assert.equal(x.d.policyId,'exploration-mountain-riddle');
  console.log('stabilization expedition attempt runtime selftest passed');
}finally{if(server?.listening)await new Promise(resolve=>server.close(resolve));fs.rmSync(tempDir,{recursive:true,force:true})}
