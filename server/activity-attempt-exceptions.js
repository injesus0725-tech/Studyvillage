/* v1.19 per-student extra activity attempts.
   Extra attempts and their history are stored in settings so backup/restore preserves them. */

const PREFIX='activity-attempt-extra:v1:';
const HISTORY_KEY='activity-attempt-extra-history:v1';
const SAFE_ACTIVITY=/^[a-z0-9-]{1,40}$/;
const clean=(v,n=160)=>String(v??'').trim().slice(0,n);
const exactName=v=>{const name=String(v??'').trim();return name&&name.length<=12?name:''};
const keyFor=(name,activityId)=>`${PREFIX}${encodeURIComponent(name)}:${activityId}`;
const parseHistoryStore=getSetting=>{
  const raw=getSetting(HISTORY_KEY);if(raw===null||raw===undefined||raw==='')return{ok:true,rows:[]};
  try{const parsed=JSON.parse(raw);return Array.isArray(parsed)?{ok:true,rows:parsed}:{ok:false,code:'invalid-history-store'}}catch{return{ok:false,code:'invalid-history-store'}}
};

export function readExtraAttempts(getSetting,name,activityId){
  const playerName=exactName(name),id=clean(activityId,40);if(!playerName||!SAFE_ACTIVITY.test(id))return 0;
  const n=Number(getSetting(keyFor(playerName,id))||0);
  return Number.isInteger(n)&&n>0?Math.min(1000,n):0;
}

export function readExtraAttemptHistory(getSetting,{limit=200,name='',activityId=''}={}){
  const store=parseHistoryStore(getSetting),rows=store.ok?store.rows.slice(-1000):[];
  const rawName=String(name??'').trim();
  if(rawName.length>12)return[];
  const safeName=rawName,safeActivity=clean(activityId,40),requestedLimit=Number(limit),max=Math.max(1,Math.min(1000,Number.isFinite(requestedLimit)?Math.floor(requestedLimit):200));
  if(safeActivity&&!SAFE_ACTIVITY.test(safeActivity))return[];
  return rows.filter(r=>(!safeName||r.name===safeName)&&(!safeActivity||r.activityId===safeActivity)).slice(-max).reverse();
}

export function appendExtraAttemptHistory(getSetting,setSetting,{name,activityId,type,amount,before,after,detail=''}={}){
  const safeName=exactName(name),id=clean(activityId,40),change=Number(amount),beforeValue=Number(before),afterValue=Number(after);
  if(!safeName||!SAFE_ACTIVITY.test(id)||!['grant','set','consume'].includes(type))return{ok:false,code:'invalid-history-entry'};
  if(!Number.isInteger(beforeValue)||!Number.isInteger(afterValue)||beforeValue<0||beforeValue>1000||afterValue<0||afterValue>1000)return{ok:false,code:'invalid-history-value'};
  const delta=Number.isInteger(change)?change:afterValue-beforeValue;
  if(!Number.isInteger(delta)||afterValue-beforeValue!==delta)return{ok:false,code:'invalid-history-delta'};
  if(type==='grant'&&delta<=0)return{ok:false,code:'invalid-history-delta'};
  if(type==='consume'&&delta>=0)return{ok:false,code:'invalid-history-delta'};
  const store=parseHistoryStore(getSetting);if(!store.ok)return store;
  const rows=store.rows.slice(-999),entry={id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,name:safeName,activityId:id,type,amount:delta,before:beforeValue,after:afterValue,detail:clean(detail,240),createdAt:new Date().toISOString()};
  rows.push(entry);setSetting(HISTORY_KEY,JSON.stringify(rows));return{ok:true,entry};
}

export function removeExtraAttemptStudentData({getSetting,setSetting,deleteSetting,listSettingKeys},name){
  const playerName=exactName(name);if(!playerName)return{ok:false,code:'invalid-player-name'};
  if(typeof getSetting!=='function'||typeof setSetting!=='function'||typeof deleteSetting!=='function'||typeof listSettingKeys!=='function')return{ok:false,code:'invalid-cleanup-adapter'};
  const store=parseHistoryStore(getSetting);if(!store.ok)return store;
  const prefix=`${PREFIX}${encodeURIComponent(playerName)}:`,keys=listSettingKeys(prefix);
  if(!Array.isArray(keys))return{ok:false,code:'invalid-cleanup-keys'};
  const filtered=store.rows.filter(row=>String(row?.name||'')!==playerName);
  let removedSettings=0;for(const key of keys){if(typeof key==='string'&&key.startsWith(prefix)){deleteSetting(key);removedSettings++}}
  if(filtered.length!==store.rows.length)setSetting(HISTORY_KEY,JSON.stringify(filtered.slice(-1000)));
  return{ok:true,name:playerName,removedSettings,removedHistory:store.rows.length-filtered.length};
}

export function setExtraAttempts(setSetting,name,activityId,count){
  const rawName=String(name??'').trim(),playerName=exactName(rawName),id=clean(activityId,40),n=Number(count);
  if(!rawName)return{ok:false,code:'player-required'};
  if(!playerName)return{ok:false,code:'invalid-player-name'};
  if(!SAFE_ACTIVITY.test(id))return{ok:false,code:'invalid-activity-id'};
  if(!Number.isInteger(n)||n<0||n>1000)return{ok:false,code:'invalid-extra-attempts'};
  setSetting(keyFor(playerName,id),String(n));
  return{ok:true,name:playerName,activityId:id,extraAttempts:n};
}

export function grantExtraAttempts(getSetting,setSetting,name,activityId,amount=1,{recordHistory=true}={}){
  const rawName=String(name??'').trim(),playerName=exactName(rawName),id=clean(activityId,40),add=Number(amount);
  if(!rawName)return{ok:false,code:'player-required'};
  if(!playerName)return{ok:false,code:'invalid-player-name'};
  if(!SAFE_ACTIVITY.test(id))return{ok:false,code:'invalid-activity-id'};
  if(!Number.isInteger(add)||add<1||add>100)return{ok:false,code:'invalid-grant'};
  const current=readExtraAttempts(getSetting,playerName,id),next=Math.min(1000,current+add),result=setExtraAttempts(setSetting,playerName,id,next);
  if(result.ok&&recordHistory&&next>current)appendExtraAttemptHistory(getSetting,setSetting,{name:result.name,activityId:id,type:'grant',amount:next-current,before:current,after:next,detail:'교사가 추가 도전 허용'});
  return result;
}

export function consumeExtraAttempts(getSetting,setSetting,name,activityId,amount=1,detail='학생 활동에 사용'){
  const rawName=String(name??'').trim(),playerName=exactName(rawName),id=clean(activityId,40),use=Number(amount);
  if(!rawName)return{ok:false,code:'player-required'};
  if(!playerName)return{ok:false,code:'invalid-player-name'};
  if(!SAFE_ACTIVITY.test(id))return{ok:false,code:'invalid-activity-id'};
  if(!Number.isInteger(use)||use<1||use>100)return{ok:false,code:'invalid-consume'};
  const current=readExtraAttempts(getSetting,playerName,id);if(current<use)return{ok:false,code:'insufficient-extra-attempts',extraAttempts:current};
  const next=current-use,result=setExtraAttempts(setSetting,playerName,id,next);
  if(result.ok)appendExtraAttemptHistory(getSetting,setSetting,{name:result.name,activityId:id,type:'consume',amount:-use,before:current,after:next,detail});
  return{...result,used:use};
}

export function installActivityAttemptExceptionRoutes(app,{requireAdmin,getSetting,setSetting}){
  app.get('/api/admin/activity-attempt-extra-history',requireAdmin,(req,res)=>{
    res.json({ok:true,entries:readExtraAttemptHistory(getSetting,{limit:req.query.limit,name:req.query.name,activityId:req.query.activityId})});
  });
  app.get('/api/admin/activity-attempt-extra/:name/:activityId',requireAdmin,(req,res)=>{
    const rawName=String(req.params.name??'').trim(),name=exactName(rawName),activityId=clean(req.params.activityId,40);
    if(!rawName)return res.status(400).json({ok:false,code:'player-required'});
    if(!name)return res.status(400).json({ok:false,code:'invalid-player-name'});
    if(!SAFE_ACTIVITY.test(activityId))return res.status(400).json({ok:false,code:'invalid-activity-id'});
    res.json({ok:true,name,activityId,extraAttempts:readExtraAttempts(getSetting,name,activityId)});
  });
  app.post('/api/admin/activity-attempt-extra/:name/:activityId/grant',requireAdmin,(req,res)=>{
    const result=grantExtraAttempts(getSetting,setSetting,req.params.name,req.params.activityId,req.body?.amount??1);
    if(!result.ok)return res.status(400).json(result);
    res.json(result);
  });
  app.put('/api/admin/activity-attempt-extra/:name/:activityId',requireAdmin,(req,res)=>{
    const rawName=String(req.params.name??'').trim(),name=exactName(rawName),activityId=clean(req.params.activityId,40);
    if(!rawName)return res.status(400).json({ok:false,code:'player-required'});
    if(!name)return res.status(400).json({ok:false,code:'invalid-player-name'});
    if(!SAFE_ACTIVITY.test(activityId))return res.status(400).json({ok:false,code:'invalid-activity-id'});
    const before=readExtraAttempts(getSetting,name,activityId),result=setExtraAttempts(setSetting,name,activityId,req.body?.extraAttempts);
    if(!result.ok)return res.status(400).json(result);
    if(result.extraAttempts!==before)appendExtraAttemptHistory(getSetting,setSetting,{name:result.name,activityId,type:'set',amount:result.extraAttempts-before,before,after:result.extraAttempts,detail:'교사가 추가 도전 횟수 직접 수정'});
    res.json(result);
  });
}
