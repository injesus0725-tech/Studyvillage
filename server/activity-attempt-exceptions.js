/* v1.9 per-student extra activity attempts.
   Extra attempts are stored in settings so backup/restore preserves them.
   This module only manages grants; student enforcement is connected separately. */

const PREFIX='activity-attempt-extra:v1:';
const SAFE_ACTIVITY=/^[a-z0-9-]{1,40}$/;
const clean=(v,n=80)=>String(v??'').trim().slice(0,n);
const keyFor=(name,activityId)=>`${PREFIX}${encodeURIComponent(clean(name,12))}:${activityId}`;

export function readExtraAttempts(getSetting,name,activityId){
  const id=clean(activityId,40);if(!SAFE_ACTIVITY.test(id))return 0;
  const n=Number(getSetting(keyFor(name,id))||0);
  return Number.isInteger(n)&&n>0?Math.min(1000,n):0;
}

export function setExtraAttempts(setSetting,name,activityId,count){
  const id=clean(activityId,40),n=Number(count);
  if(!clean(name,12))return{ok:false,code:'player-required'};
  if(!SAFE_ACTIVITY.test(id))return{ok:false,code:'invalid-activity-id'};
  if(!Number.isInteger(n)||n<0||n>1000)return{ok:false,code:'invalid-extra-attempts'};
  setSetting(keyFor(name,id),String(n));
  return{ok:true,name:clean(name,12),activityId:id,extraAttempts:n};
}

export function grantExtraAttempts(getSetting,setSetting,name,activityId,amount=1){
  const add=Number(amount);if(!Number.isInteger(add)||add<1||add>100)return{ok:false,code:'invalid-grant'};
  const current=readExtraAttempts(getSetting,name,activityId),next=Math.min(1000,current+add);
  return setExtraAttempts(setSetting,name,activityId,next);
}

export function installActivityAttemptExceptionRoutes(app,{requireAdmin,getSetting,setSetting}){
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
    const result=setExtraAttempts(setSetting,req.params.name,req.params.activityId,req.body?.extraAttempts);
    if(!result.ok)return res.status(400).json(result);
    res.json(result);
  });
}
