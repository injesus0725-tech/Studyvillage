/* v1.9 teacher-configurable activity attempt policies.
   Stored in settings so backup/restore preserves them. Student route exposes only one read-only policy. */
import { validateAttemptPolicyMap, normalizeAttemptPolicy } from './activity-attempt-policy.js';

const STORE_KEY='activity-attempt-policies:v1';
const SAFE_ACTIVITY=/^[a-z0-9-]{1,40}$/;
const clean=(v,n=80)=>String(v??'').trim().slice(0,n);
const DAILY_MATH_POLICY=Object.freeze({mode:'limited',limit:3,xpMode:'every-attempt',period:'daily'});

export function readActivityAttemptPolicies(getSetting){
  try{
    const raw=JSON.parse(getSetting(STORE_KEY)||'{}');
    const checked=validateAttemptPolicyMap(raw);
    return checked.ok?{...checked.policies,'math-arithmetic':DAILY_MATH_POLICY}:{'math-arithmetic':DAILY_MATH_POLICY};
  }catch{return{'math-arithmetic':DAILY_MATH_POLICY}}
}

export function installActivityAttemptSettingRoutes(app,{requireAdmin,getSetting,setSetting}){
  app.get('/api/activity-attempt-policy/:activityId',(req,res)=>{
    const activityId=String(req.params.activityId??'').trim();
    if(!SAFE_ACTIVITY.test(activityId))return res.status(400).json({ok:false,code:'invalid-activity-id'});
    const policies=readActivityAttemptPolicies(getSetting),raw=policies[activityId]||{},policy=normalizeAttemptPolicy(raw);
    res.json({ok:true,activityId,policy:{...policy,period:raw.period||'all-time'}});
  });

  app.get('/api/admin/activity-attempt-policies',requireAdmin,(_req,res)=>{
    res.json({ok:true,policies:readActivityAttemptPolicies(getSetting)});
  });

  app.put('/api/admin/activity-attempt-policies',requireAdmin,(req,res)=>{
    const checked=validateAttemptPolicyMap(req.body?.policies);
    if(!checked.ok)return res.status(400).json({ok:false,code:clean(checked.code),activityId:clean(checked.activityId)});
    setSetting(STORE_KEY,JSON.stringify(checked.policies));
    res.json({ok:true,policies:readActivityAttemptPolicies(getSetting)});
  });
}
