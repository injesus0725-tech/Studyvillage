/* v1.9 teacher-configurable activity attempt policies.
   Stored in settings so backup/restore preserves them. Core classroom attempts reset at Korea midnight. */
import { validateAttemptPolicyMap, normalizeAttemptPolicy } from './activity-attempt-policy.js';

const STORE_KEY='activity-attempt-policies:v1';
const SAFE_ACTIVITY=/^[a-z0-9-]{1,40}$/;
const clean=(v,n=80)=>String(v??'').trim().slice(0,n);
const DAILY_CORE_POLICIES=Object.freeze({
  'library-vocabulary':Object.freeze({mode:'limited',limit:1,xpMode:'every-attempt',period:'daily'}),
  'math-arithmetic':Object.freeze({mode:'limited',limit:3,xpMode:'every-attempt',period:'daily'}),
  'curriculum-korean':Object.freeze({mode:'limited',limit:2,xpMode:'every-attempt',period:'daily'}),
  'curriculum-math':Object.freeze({mode:'limited',limit:2,xpMode:'every-attempt',period:'daily'}),
  'curriculum-social':Object.freeze({mode:'limited',limit:2,xpMode:'every-attempt',period:'daily'}),
  'curriculum-science':Object.freeze({mode:'limited',limit:2,xpMode:'every-attempt',period:'daily'}),
  'curriculum-arts':Object.freeze({mode:'limited',limit:2,xpMode:'every-attempt',period:'daily'}),
  'curriculum-integrated':Object.freeze({mode:'limited',limit:2,xpMode:'every-attempt',period:'daily'}),
  'exploration-korean':Object.freeze({mode:'limited',limit:3,xpMode:'every-attempt',period:'daily'}),
  'exploration-math':Object.freeze({mode:'limited',limit:3,xpMode:'every-attempt',period:'daily'}),
  'exploration-random':Object.freeze({mode:'limited',limit:3,xpMode:'every-attempt',period:'daily'})
});
// Core learning activities always reward every teacher-authorized completion.
// Attempt limits control whether another play is allowed; they must not silently become reward caps.
const REPEAT_XP_ACTIVITIES=new Set(['library-vocabulary','math-arithmetic','curriculum-korean','curriculum-math','curriculum-social','curriculum-science','curriculum-arts','curriculum-integrated','exploration-korean','exploration-math','exploration-random']);
const RETIRED_ACTIVITY_IDS=new Set(['riddle-demo','exploration-social','exploration-science']);
const withDailyReset=policy=>{
  const normalized=normalizeAttemptPolicy(policy||{});
  return normalized.mode==='unlimited'?{...normalized,period:'all-time'}:{...normalized,period:'daily'};
};

export function readActivityAttemptPolicies(getSetting){
  try{
    const raw=JSON.parse(getSetting(STORE_KEY)||'{}');
    const checked=validateAttemptPolicyMap(raw);
    const saved=checked.ok?Object.fromEntries(Object.entries(checked.policies).filter(([id])=>!RETIRED_ACTIVITY_IDS.has(id)).map(([id,policy])=>{const normalized=withDailyReset(policy);return[id,REPEAT_XP_ACTIVITIES.has(id)?{...normalized,xpMode:'every-attempt'}:normalized]})):{};
    // Defaults fill only missing activities. Retired activities are filtered so old saved settings cannot reappear in admin.
    return{...DAILY_CORE_POLICIES,...saved};
  }catch{return{...DAILY_CORE_POLICIES}}
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
    const incoming=req.body?.policies&&typeof req.body.policies==='object'?Object.fromEntries(Object.entries(req.body.policies).filter(([id])=>!RETIRED_ACTIVITY_IDS.has(id))):req.body?.policies;
    const checked=validateAttemptPolicyMap(incoming);
    if(!checked.ok)return res.status(400).json({ok:false,code:clean(checked.code),activityId:clean(checked.activityId)});
    setSetting(STORE_KEY,JSON.stringify(checked.policies));
    res.json({ok:true,policies:readActivityAttemptPolicies(getSetting)});
  });
}
