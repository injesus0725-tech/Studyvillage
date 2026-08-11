/* v1.9 score alert false-positive policy.
   Pure read-only classification helpers. No DB writes and no automatic score correction. */

const DEFAULTS=Object.freeze({
  duplicateWindowMs:5000,
  largeXpDelta:200,
  largeActivityScoreDelta:1000,
  largeTotalScoreDelta:2000
});

const LOW_PRIORITY_SOURCES=new Set(['teacher-correction','teacher-undo','record-reset','admin-reset']);

export function normalizeScoreAlertPolicy(input={}){
  const int=(v,d,min,max)=>{const n=Number(v);return Number.isInteger(n)?Math.max(min,Math.min(max,n)):d};
  return Object.freeze({
    duplicateWindowMs:int(input.duplicateWindowMs,DEFAULTS.duplicateWindowMs,1000,60000),
    largeXpDelta:int(input.largeXpDelta,DEFAULTS.largeXpDelta,50,100000),
    largeActivityScoreDelta:int(input.largeActivityScoreDelta,DEFAULTS.largeActivityScoreDelta,100,1000000),
    largeTotalScoreDelta:int(input.largeTotalScoreDelta,DEFAULTS.largeTotalScoreDelta,100,10000000)
  });
}

export function classifyScoreLedgerEntry(entry={},previous=null,policyInput={}){
  const policy=normalizeScoreAlertPolicy(policyInput),delta=Number(entry.delta)||0,source=String(entry.source||''),reasons=[];
  if(LOW_PRIORITY_SOURCES.has(source))return{priority:'low',reasons:['교사 수정/초기화 경로'],suppressed:true,policy};
  if(entry.field==='xp'&&Math.abs(delta)>=policy.largeXpDelta)reasons.push('한 번에 큰 XP 변화');
  if(entry.scope==='activity'&&Math.abs(delta)>policy.largeActivityScoreDelta)reasons.push('활동 점수의 큰 단일 변화');
  if(entry.scope==='player'&&entry.field!=='xp'&&Math.abs(delta)>=policy.largeTotalScoreDelta)reasons.push('전체 점수의 큰 단일 변화');
  if(delta<0)reasons.push('예상 밖 감소');
  if(previous){
    const same=previous.playerName===entry.playerName&&previous.scope===entry.scope&&previous.activityId===entry.activityId&&previous.field===entry.field&&Number(previous.delta)===delta;
    const gap=Math.abs(new Date(entry.createdAt).getTime()-new Date(previous.createdAt).getTime());
    if(same&&Number.isFinite(gap)&&gap<=policy.duplicateWindowMs)reasons.push('짧은 시간 안에 동일 증감 반복');
  }
  return{priority:reasons.length?'review':'none',reasons,suppressed:false,policy};
}

export function scoreAlertPolicyDefaults(){return{...DEFAULTS}}
