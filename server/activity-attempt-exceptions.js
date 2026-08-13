/* v1.13 per-student extra activity attempts.
   Extra attempts and their history are stored in settings so backup/restore preserves them. */

const PREFIX='activity-attempt-extra:v1:';
const HISTORY_KEY='activity-attempt-extra-history:v1';
const SAFE_ACTIVITY=/^[a-z0-9-]{1,40}$/;
const clean=(v,n=160)=>String(v??'').trim().slice(0,n);
const keyFor=(name,activityId)=>`${PREFIX}${encodeURIComponent(clean(name,12))}:${activityId}`;

export function readExtraAttempts(getSetting,name,activityId){
  const id=clean(activityId,40);if(!SAFE_ACTIVITY.test(id))return 0;
  const n=Number(getSetting(keyFor(name,id))||0);
  return Number.isInteger(n)&&n>0?Math.min(1000,n):0;
}

export function readExtraAttemptHistory(getSetting,{limit=200,name='',activityId=''}={}){
  let rows=[];try{const parsed=JSON.parse(getSetting(HISTORY_KEY)||'[]');if(Array.isArray(parsed))rows=parsed.slice(-1000)}catch{}
  const rawName=String(name??'').trim();
  if(rawName.length>12)return[];
  const safeName=clean(rawName,12),safeActivity=clean(activityId,40),requestedLimit=Number(limit),max=Math.max(1,Math.min(1000,Number.isFinite(requestedLimit)?Math.floor(requestedLimit):200));
  if(safeActivity&&!SAFE_ACTIVITY.test(safeActivity))return[];
  return rows.filter(r=>(!safeName||r.name===safeName)&&(!safeActivity||r.activityId===safeActivity)).slice(-max).reverse();
}

export function appendExtraAttemptHistory(getSetting,setSetting,{name,activityId,type,amount,before,after,detail=''}={}){
  const safeName=clean(name,12),id=clean(activityId,40),change=Number(amount),beforeValue=Number(before),afterValue=Number(after);
  if(!safeName||!SAFE_ACTIVITY.test(id)||!['grant','set','consume'].includes(type))return{ok:false,code:'invalid-history-entry'};
  if(!Number.isInteger(beforeValue)||!Number.isInteger(afterValue)||beforeValue<0||beforeValue>1000||afterValue<0||afterValue>1000)return{ok:false,code:'invalid-history-value'};
  const delta=Number.isInteger(change)?change:afterValue-beforeValue;
  if(!Number.isInteger(delta)||afterValue-beforeValue!==delta)return{ok:false,code:'invalid-history-delta'};
  if(type==='grant'&&delta<=0)return{ok:false,code:'invalid-history-delta'};
  if(type==='consume'&&delta>=0)return{ok:false,code:'invalid-history-delta'};
  let rows=[];try{const parsed=JSON.parse(getSetting(HISTORY_KEY)||'[]');if(Array.isArray(parsed))rows=parsed}catch{}
  const entry={id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,name:safeName,activityId:id,type,amount:delta,before:beforeValue,after:afterValue,detail:clean(detail,240),createdAt:new Date().toISOString()};
  rows.push(entry);setSetting(HISTORY_KEY,JSON.stringify(rows.slice(-1000)));return{ok:true,entry};
}

export function setExtraAttempts(setSetting,name,activityId,count){
  const id=clean(activityId,40),n=Number(count);
  if(!clean(name,12))return{ok:false,code:'player-required'};
  if(!SAFE_ACTIVITY.test(id))return{ok:false,code:'invalid-activity-id'};
  if(!Number.isInteger(n)||n<0||n>1000)return{ok:false,code:'invalid-extra-attempts'};
  setSetting(keyFor(name,id),String(n));
  return{ok:true,name:clean(name,12),activityId:id,extraAttempts:n};
}

export function grantExtraAttempts(getSetting,setSetting,name,activityId,amount=1,{recordHistory=true}={}){
  const add=Number(amount);if(!Number.isInteger(add)||add<1||add>100)return{ok:false,code:'invalid-grant'};
  const current=readExtraAttempts(getSetting,name,activityId),next=Math.min(1000,current+add),result=setExtraAttempts(setSetting,name,activityId,next);
  if(result.ok&&recordHistory&&next>current)appendExtraAttemptHistory(getSetting,setSetting,{name,activityId,type:'grant',amount:next-current,before:current,after:next,detail:'교사가 추가 도전 허용'});
  return result;
}

export function consumeExtraAttempts(getSetting,setSetting,name,activityId,amount=1,detail='학생 활동에 사용'){
  const use=Number(amount);if(!Number.isInteger(use)||use<1||use>100)return{ok:false,code:'invalid-consume'};
  const current=readExtraAttempts(getSetting,name,activityId);if(current<use)return{ok:false,code:'insufficient-extra-attempts',extraAttempts:current};
  const next=current-use,result=setExtraAttempts(setSetting,name,activityId,next);
  if(result.ok)appendExtraAttemptHistory(getSetting,setSetting,{name,activityId,type:'consume',amount:-use,before:current,after:next,detail});
  return{...result,used:use};
}

export function installActivityAttemptExceptionRoutes(app,{requireAdmin,getSetting,setSetting}){
  app.get('/api/admin/activity-attempt-extra-history',requireAdmin,(req,res)=>{
    res.json({ok:true,entries:readExtraAttemptHistory(getSetting,{limit:req.query.limit,name:req.query.name,activityId:req.query.activityId})});
  });
  app.get('/api/admin/activity-attempt-extra/:name/:activityId',requireAdmin,(req,res)=>{
    const name=clean(req.params.name,12),activityId=clean(req.params.activityId,40);
    if(!name)return res.status(400).json({ok:false,code:'player-required'});
    if(!SAFE_ACTIVITY.test(activityId))return res.status(400).json({ok:false,code:'invalid-activity-id'});
    res.json({ok:true,name,activityId,extraAttempts:readExtraAttempts(getSetting,name,activityId)});
  });
  app.post('/api/admin/activity-attempt-extra/:name/:activityId/grant',requireAdmin,(req,res)=>{
    const result=grantExtraAttempts(getSetting,setSetting,req.params.name,req.params.activityId,req.body?.amount??1);
    if(!result.ok)return res.status(400).json(result);
    res.json(result);
  });
  app.put('/api/admin/activity-attempt-extra/:name/:activityId',requireAdmin,(req,res)=>{
    const name=clean(req.params.name,12),activityId=clean(req.params.activityId,40),before=readExtraAttempts(getSetting,name,activityId),result=setExtraAttempts(setSetting,name,activityId,req.body?.extraAttempts);
    if(!result.ok)return res.status(400).json(result);
    appendExtraAttemptHistory(getSetting,setSetting,{name,activityId,type:'set',amount:result.extraAttempts-before,before,after:result.extraAttempts,detail:'교사가 추가 도전 횟수 직접 수정'});
    res.json(result);
  });
}
