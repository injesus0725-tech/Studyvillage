/* v1.9 activity attempt policy foundation.
   Supports one-shot, limited, and unlimited activities without changing existing activity engines yet.
   This module is pure policy logic so teacher configuration and student gates can share the same rules later. */

const MAX_LIMIT=1000;
const SAFE_ACTIVITY=/^[a-z0-9-]{1,40}$/;

export const ATTEMPT_MODES=Object.freeze({
  ONCE:'once',
  LIMITED:'limited',
  UNLIMITED:'unlimited'
});

export function normalizeAttemptPolicy(input={}){
  const mode=String(input?.mode||ATTEMPT_MODES.UNLIMITED);
  if(mode===ATTEMPT_MODES.ONCE)return{mode,limit:1,xpMode:'first-completion'};
  if(mode===ATTEMPT_MODES.LIMITED){
    const limit=Math.max(1,Math.min(MAX_LIMIT,Number(input?.limit)||1));
    return{mode,limit,xpMode:String(input?.xpMode||'first-completion')==='every-attempt'?'every-attempt':'first-completion'};
  }
  return{mode:ATTEMPT_MODES.UNLIMITED,limit:null,xpMode:String(input?.xpMode||'first-completion')==='every-attempt'?'every-attempt':'first-completion'};
}

export function evaluateAttempt(policyInput={},record={}){
  const policy=normalizeAttemptPolicy(policyInput),attempts=Math.max(0,Number(record?.attempts)||0);
  const unlimited=policy.mode===ATTEMPT_MODES.UNLIMITED;
  const remaining=unlimited?null:Math.max(0,policy.limit-attempts);
  const allowed=unlimited||remaining>0;
  const awardXp=allowed&&(policy.xpMode==='every-attempt'||attempts===0);
  return Object.freeze({policy,attempts,remaining,allowed,awardXp,completed:attempts>0});
}

export function validateAttemptPolicyMap(value){
  if(!value||typeof value!=='object'||Array.isArray(value))return{ok:false,code:'invalid-policy-map'};
  const policies={};
  for(const [activityId,raw] of Object.entries(value)){
    if(!SAFE_ACTIVITY.test(activityId))return{ok:false,code:'invalid-activity-id',activityId};
    policies[activityId]=normalizeAttemptPolicy(raw);
  }
  return{ok:true,policies};
}

export const activityAttemptPolicyLimits=Object.freeze({maxLimit:MAX_LIMIT});
