/* v1.10 activity attempt policy foundation with teacher-selectable daily/all-time reset periods. */
const MAX_LIMIT=1000;
const SAFE_ACTIVITY=/^[a-z0-9-]{1,40}$/;

export const ATTEMPT_MODES=Object.freeze({ONCE:'once',LIMITED:'limited',UNLIMITED:'unlimited'});
export const ATTEMPT_PERIODS=Object.freeze({DAILY:'daily',ALL_TIME:'all-time'});
const periodOf=input=>String(input?.period||ATTEMPT_PERIODS.ALL_TIME)===ATTEMPT_PERIODS.DAILY?ATTEMPT_PERIODS.DAILY:ATTEMPT_PERIODS.ALL_TIME;

export function normalizeAttemptPolicy(input={}){
  const mode=String(input?.mode||ATTEMPT_MODES.UNLIMITED),period=periodOf(input);
  if(mode===ATTEMPT_MODES.ONCE)return{mode,limit:1,xpMode:'first-completion',period};
  if(mode===ATTEMPT_MODES.LIMITED){const limit=Math.max(1,Math.min(MAX_LIMIT,Number(input?.limit)||1));return{mode,limit,xpMode:String(input?.xpMode||'first-completion')==='every-attempt'?'every-attempt':'first-completion',period};}
  return{mode:ATTEMPT_MODES.UNLIMITED,limit:null,xpMode:String(input?.xpMode||'first-completion')==='every-attempt'?'every-attempt':'first-completion',period};
}

export function evaluateAttempt(policyInput={},record={}){
  const policy=normalizeAttemptPolicy(policyInput),attempts=Math.max(0,Number(record?.attempts)||0),unlimited=policy.mode===ATTEMPT_MODES.UNLIMITED,remaining=unlimited?null:Math.max(0,policy.limit-attempts),allowed=unlimited||remaining>0,awardXp=allowed&&(policy.xpMode==='every-attempt'||attempts===0);
  return Object.freeze({policy,attempts,remaining,allowed,awardXp,completed:attempts>0});
}

export function validateAttemptPolicyMap(value){
  if(!value||typeof value!=='object'||Array.isArray(value))return{ok:false,code:'invalid-policy-map'};
  const policies={};for(const[activityId,raw]of Object.entries(value)){if(!SAFE_ACTIVITY.test(activityId))return{ok:false,code:'invalid-activity-id',activityId};policies[activityId]=normalizeAttemptPolicy(raw)}return{ok:true,policies};
}
export const activityAttemptPolicyLimits=Object.freeze({maxLimit:MAX_LIMIT});
