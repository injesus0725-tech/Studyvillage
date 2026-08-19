import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tempDir=fs.mkdtempSync(path.join(os.tmpdir(),'studyvillage-release-critical-'));
const port=43000+Math.floor(Math.random()*1000);
process.env.STUDYVILLAGE_DATA_DIR=tempDir;
process.env.STUDYVILLAGE_EMBEDDED='1';
process.env.PORT=String(port);
const base=`http://127.0.0.1:${port}`;
const request=async(url,{method='GET',token,body}={})=>{
  const response=await fetch(base+url,{method,headers:{...(token?{Authorization:`Bearer ${token}`}:{ }),...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const data=await response.json().catch(()=>({}));
  return{response,data};
};
let server;
try{
  const mod=await import(`./server/server.js?release-critical=${Date.now()}`);
  server=mod.startClassroomServer();
  await new Promise((resolve,reject)=>{if(server.listening)return resolve();server.once('listening',resolve);server.once('error',reject)});

  let result=await request('/api/login',{method:'POST',body:{name:'후보판학생',password:'1234'}});
  assert.equal(result.response.status,200,'student login must work');
  const student=result.data.token;assert.ok(student);
  result=await request('/api/admin/login',{method:'POST',body:{password:'teacher1234'}});
  assert.equal(result.response.status,200,'teacher login must work');
  const admin=result.data.token;assert.ok(admin);

  result=await request('/api/admin/players',{token:admin});
  assert.equal(result.response.status,200,'teacher student list must load');
  assert.ok((result.data.players||[]).some(row=>row.name==='후보판학생'),'new student must appear in teacher list');

  result=await request('/api/admin/activity-attempt-policies',{token:admin});
  assert.equal(result.response.status,200,'teacher attempt policies must load');
  const next={...(result.data.policies||{}),
    'math-arithmetic':{mode:'limited',limit:2,xpMode:'every-attempt'},
    'library-vocabulary':{mode:'limited',limit:2,xpMode:'every-attempt'},
    'exploration-forest-riddle':{mode:'limited',limit:2,xpMode:'first-completion'}
  };
  result=await request('/api/admin/activity-attempt-policies',{method:'PUT',token:admin,body:{policies:next}});
  assert.equal(result.response.status,200,'teacher attempt policies must save');
  assert.equal(result.data.policies?.['math-arithmetic']?.period,'daily','math must remain a daily classroom policy after teacher save');
  assert.equal(result.data.policies?.['library-vocabulary']?.period,'daily','bookmaru must remain a daily classroom policy after teacher save');

  result=await request('/api/player/me/activity-attempt-status/math-arithmetic',{token:student});
  assert.equal(result.response.status,200);assert.equal(result.data.policy?.period,'daily');assert.equal(result.data.remaining,2);
  result=await request('/api/player/me/activity-attempt-status/library-vocabulary',{token:student});
  assert.equal(result.response.status,200);assert.equal(result.data.policy?.period,'daily');assert.equal(result.data.remaining,2);
  result=await request('/api/player/me/activity-attempt-status/exploration-forest-riddle',{token:student});
  assert.equal(result.response.status,200);assert.equal(result.data.policy?.period,'all-time');assert.equal(result.data.remaining,2);

  result=await request('/api/player/me/checkpoints/math-arithmetic',{method:'PUT',token:student,body:{progress:{index:2,answers:[1,2]}}});
  assert.equal(result.response.status,200,'student checkpoint save must work');
  result=await request('/api/admin/checkpoints',{token:admin});
  assert.equal(result.response.status,200,'teacher checkpoint overview must load');
  assert.ok((result.data.checkpoints||[]).some(row=>row.playerName==='후보판학생'&&row.activityId==='math-arithmetic'),'teacher must see student checkpoint');
  result=await request(`/api/admin/player/${encodeURIComponent('후보판학생')}/checkpoints/math-arithmetic`,{method:'DELETE',token:admin});
  assert.equal(result.response.status,200,'teacher checkpoint delete button path must work');
  result=await request('/api/admin/checkpoints',{token:admin});
  assert.ok(!(result.data.checkpoints||[]).some(row=>row.playerName==='후보판학생'&&row.activityId==='math-arithmetic'),'deleted checkpoint must disappear from teacher overview');

  result=await request('/api/admin/shop',{token:admin});
  assert.equal(result.response.status,200,'teacher shop must load without 500');
  const items=Array.isArray(result.data.items)?result.data.items:[];assert.ok(items.length>0,'shop catalog must not be empty');
  const prices={},availability={},levelRequirements={},limited={},saleStarts={},saleEnds={};
  for(const item of items){prices[item.id]=Number(item.price)||0;availability[item.id]=item.available!==false;levelRequirements[item.id]=Number(item.requiredLevel)||1;limited[item.id]=!!item.limited;saleStarts[item.id]=item.saleStartsAt||null;saleEnds[item.id]=item.saleEndsAt||null;}
  result=await request('/api/admin/shop',{method:'PUT',token:admin,body:{enabled:true,prices,availability,levelRequirements,limited,saleStarts,saleEnds}});
  assert.equal(result.response.status,200,'teacher shop save button path must work');assert.equal(result.data.ok,true);

  result=await request(`/api/admin/stars/${encodeURIComponent('후보판학생')}/adjust`,{method:'POST',token:admin,body:{delta:40,reason:'후보판 실물 전달 검증'}});
  assert.equal(result.response.status,200,'teacher star grant must work');assert.equal(result.data.afterValue,40);
  result=await request('/api/shop/purchase',{method:'POST',token:student,body:{itemId:'candy'}});
  assert.equal(result.response.status,200,'physical candy purchase must work');assert.equal(result.data.fulfillment,'teacher-delivery');
  const candyRequestId=result.data.deliveryRequestId;assert.ok(Number.isInteger(candyRequestId));assert.equal(result.data.balance,35);
  result=await request('/api/admin/shop',{token:admin});
  assert.ok((result.data.deliveryRequests||[]).some(row=>row.id===candyRequestId&&row.status==='pending'),'teacher delivery list must show pending candy request');
  result=await request(`/api/admin/shop/delivery/${candyRequestId}/refund`,{method:'POST',token:admin,body:{}});
  assert.equal(result.response.status,200,'teacher refund button path must work');assert.equal(result.data.action,'refund');assert.equal(result.data.balance,40,'refund must restore spent stars exactly once');
  result=await request(`/api/admin/shop/delivery/${candyRequestId}/refund`,{method:'POST',token:admin,body:{}});
  assert.equal(result.response.status,409,'resolved delivery request must not refund twice');

  result=await request('/api/shop/purchase',{method:'POST',token:student,body:{itemId:'stationery'}});
  assert.equal(result.response.status,200,'physical stationery purchase must work');const stationeryRequestId=result.data.deliveryRequestId;assert.equal(result.data.balance,25);
  result=await request(`/api/admin/shop/delivery/${stationeryRequestId}/complete`,{method:'POST',token:admin,body:{}});
  assert.equal(result.response.status,200,'teacher delivery complete button path must work');assert.equal(result.data.action,'delivered');
  result=await request(`/api/admin/stars/${encodeURIComponent('후보판학생')}`,{token:admin});
  assert.equal(result.response.status,200);assert.equal(result.data.balance,25,'completed physical delivery must keep stars spent');
  result=await request('/api/admin/shop',{token:admin});
  assert.ok((result.data.deliveryRequests||[]).some(row=>row.id===stationeryRequestId&&row.status==='delivered'),'teacher delivery list must preserve completed state');

  const concurrent=await Promise.all(Array.from({length:8},()=>request('/api/shop',{token:student})));
  for(const row of concurrent){assert.equal(row.response.status,200,'student shop concurrent reads must not return 500');assert.equal(row.data.ok,true);}

  result=await request('/api/admin/activity-state/riddle-demo',{method:'PUT',token:admin,body:{name:'도전관 · 수수께끼',open:false,message:'후보판 점검'}});
  assert.equal(result.response.status,200,'teacher activity open/close button path must work');assert.equal(result.data.activity?.open,false);
  result=await request('/api/activity-state/riddle-demo');
  assert.equal(result.response.status,200);assert.equal(result.data.activity?.open,false,'student activity state must reflect teacher change');

  result=await request('/api/admin/backup',{token:admin});
  assert.equal(result.response.status,200,'teacher backup button path must work');assert.equal(result.data.format,'studyvillage-backup');
  assert.ok((result.data.players||[]).some(row=>row.name==='후보판학생'),'backup must include active student');

  const adminUi=fs.readFileSync('admin.html','utf8');
  for(const script of ['admin-student-edit.js','admin-checkpoints.js','admin-stars.js','admin-shop.js','admin-attempt-policy.js','admin-activity-state.js','assets/admin-modal-actions.js'])assert.ok(adminUi.includes(script),`${script} must load in teacher UI`);
  const shopUi=fs.readFileSync('admin-shop.js','utf8');
  for(const token of ['data-delivery-action="complete"','data-delivery-action="refund"','/api/admin/shop/delivery/'])assert.ok(shopUi.includes(token),`teacher delivery UI must keep ${token}`);
  const attemptUi=fs.readFileSync('admin-attempt-policy.js','utf8');
  assert.ok(attemptUi.includes("daily?'오늘 ':'전체 기간 '"),'teacher attempt overview must distinguish daily and all-time remaining attempts');
  const studentAttemptUi=fs.readFileSync('assets/student-expedition-attempt-status.js','utf8');
  assert.ok(studentAttemptUi.includes("scope=daily?'오늘':'전체 기간'"),'student expedition cards must distinguish daily and all-time policies');

  console.log('release candidate classroom critical path selftest passed');
}finally{
  if(server?.listening)await new Promise(resolve=>server.close(resolve));
  fs.rmSync(tempDir,{recursive:true,force:true});
}
