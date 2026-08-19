import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';

const tempDir=fs.mkdtempSync(path.join(os.tmpdir(),'studyvillage-shop-runtime-'));
const port=41000+Math.floor(Math.random()*1000);
process.env.STUDYVILLAGE_DATA_DIR=tempDir;
process.env.STUDYVILLAGE_EMBEDDED='1';
process.env.PORT=String(port);
const base=`http://127.0.0.1:${port}`;
const req=async(url,{method='GET',token,body}={})=>{const r=await fetch(base+url,{method,headers:{...(token?{Authorization:`Bearer ${token}`} : {}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});return{r,d:await r.json().catch(()=>({}))}};
let server;
try{
  const mod=await import(`./server/server.js?shop-runtime=${Date.now()}`);server=mod.startClassroomServer();
  await new Promise((resolve,reject)=>{if(server.listening)return resolve();server.once('listening',resolve);server.once('error',reject)});
  let x=await req('/api/login',{method:'POST',body:{name:'상점검증학생',password:'1234'}});assert.equal(x.r.status,200);const student=x.d.token;
  const reads=await Promise.all(Array.from({length:6},()=>req('/api/shop',{token:student})));
  for(const row of reads){assert.equal(row.r.status,200,'valid student shop read must not return 500');assert.equal(row.d.ok,true);assert.ok(Number.isInteger(row.d.balance));assert.ok(Array.isArray(row.d.ownedItems));assert.ok(row.d.equipment&&typeof row.d.equipment==='object')}
  x=await req('/api/admin/login',{method:'POST',body:{password:'teacher1234'}});assert.equal(x.r.status,200);const admin=x.d.token;
  x=await req('/api/admin/shop',{token:admin});assert.equal(x.r.status,200,'teacher shop read must not return 500');assert.equal(x.d.ok,true);

  const db=new Database(path.join(tempDir,'studyvillage.db'));db.prepare("UPDATE players SET equipment_json='not-json' WHERE name=?").run('상점검증학생');db.close();
  x=await req('/api/shop',{token:student});assert.equal(x.r.status,409,'corrupt equipment must be reported as a data conflict, not a server 500');assert.equal(x.d.code,'corrupt-equipment');
  console.log('stabilization shop runtime selftest passed');
}finally{if(server?.listening)await new Promise(resolve=>server.close(resolve));fs.rmSync(tempDir,{recursive:true,force:true})}
