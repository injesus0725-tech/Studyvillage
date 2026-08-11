/* v1.9 teacher-configurable activity attempt policies.
   Stored in settings so backup/restore preserves them. Does not enforce attempts yet. */
import { validateAttemptPolicyMap } from './activity-attempt-policy.js';

const STORE_KEY='activity-attempt-policies:v1';
const clean=(v,n=80)=>String(v??'').trim().slice(0,n);

export function readActivityAttemptPolicies(getSetting){
  try{
    const raw=JSON.parse(getSetting(STORE_KEY)||'{}');
    const checked=validateAttemptPolicyMap(raw);
    return checked.ok?checked.policies:{};
  }catch{return{}}
}

export function installActivityAttemptSettingRoutes(app,{requireAdmin,getSetting,setSetting}){
  app.get('/api/admin/activity-attempt-policies',requireAdmin,(_req,res)=>{
    res.json({ok:true,policies:readActivityAttemptPolicies(getSetting)});
  });

  app.put('/api/admin/activity-attempt-policies',requireAdmin,(req,res)=>{
    const checked=validateAttemptPolicyMap(req.body?.policies);
    if(!checked.ok)return res.status(400).json({ok:false,code:clean(checked.code),activityId:clean(checked.activityId)});
    setSetting(STORE_KEY,JSON.stringify(checked.policies));
    res.json({ok:true,policies:checked.policies});
  });
}
