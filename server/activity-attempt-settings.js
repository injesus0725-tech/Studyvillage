/* v1.10 teacher-configurable activity attempt policies with optional Korea-midnight daily reset. */
import { validateAttemptPolicyMap, normalizeAttemptPolicy } from './activity-attempt-policy.js';

const STORE_KEY='activity-attempt-policies:v1';
const SAFE_ACTIVITY=/^[a-z0-9-]{1,40}$/;
const clean=(v,n=80)=>String(v??'').trim().slice(0,n);
const DAILY_MATH_POLICY=Object.freeze({mode:'limited',limit:3,xpMode:'every-attempt',period:'daily'});
const DAILY_BOOKMARU_POLICY=Object.freeze({mode:'limited',limit:1,xpMode:'every-attempt',period:'daily'});
const CLASSROOM_DEFAULTS=Object.freeze({'math-arithmetic':DAILY_MATH_POLICY,'library-vocabulary':DAILY_BOOKMARU_POLICY});

function mergeStoredPolicies(stored={}){
  const merged={...CLASSROOM_DEFAULTS};
  for(const[activityId,policy]of Object.entries(stored||{})){
    const classroomDefault=CLASSROOM_DEFAULTS[activityId];
    merged[activityId]=classroomDefault
      ?{...classroomDefault,...policy,period:classroomDefault.period}
      :{...policy,period:policy?.period||'all-time'};
  }
  return merged;
}
export function readActivityAttemptPolicies(getSetting){
  try{
    const raw=JSON.parse(getSetting(STORE_KEY)||'{}');
    const checked=validateAttemptPolicyMap(raw);
    return checked.ok?mergeStoredPolicies(checked.policies):mergeStoredPolicies();
  }catch{return mergeStoredPolicies()}
}
export function installActivityAttemptSettingRoutes(app,{requireAdmin,getSetting,setSetting}){
  app.get('/api/activity-attempt-policy/:activityId',(req,res)=>{const activityId=String(req.params.activityId??'').trim();if(!SAFE_ACTIVITY.test(activityId))return res.status(400).json({ok:false,code:'invalid-activity-id'});const policies=readActivityAttemptPolicies(getSetting),raw=policies[activityId]||{},policy=normalizeAttemptPolicy(raw);res.json({ok:true,activityId,policy:{...policy,period:raw.period||policy.period||'all-time'}})});
  app.get('/api/admin/activity-attempt-policies',requireAdmin,(_req,res)=>res.json({ok:true,policies:readActivityAttemptPolicies(getSetting)}));
  app.put('/api/admin/activity-attempt-policies',requireAdmin,(req,res)=>{const checked=validateAttemptPolicyMap(req.body?.policies);if(!checked.ok)return res.status(400).json({ok:false,code:clean(checked.code),activityId:clean(checked.activityId)});setSetting(STORE_KEY,JSON.stringify(checked.policies));res.json({ok:true,policies:readActivityAttemptPolicies(getSetting)})});
}
