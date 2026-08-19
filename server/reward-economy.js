/* Stabilized classroom reward economy.
   Levels should represent sustained participation, not jump several levels after a few problems.
   Target: roughly Lv.20 after a 90-day semester at about 4-5 completed activities per day. */
export const SEMESTER_REWARD_TARGET=Object.freeze({activeDays:90,averageActivitiesPerDay:4.5,targetLevel:20,targetXp:13100});

export function activityScorePercent(activityId,score){
  const maximum=activityId==='riddle'||activityId==='riddle-demo'?1000:100;
  return Math.max(0,Math.min(1,(Number(score)||0)/maximum));
}

export function activityXpReward(activityId,score){
  const id=String(activityId||'');
  const percent=activityScorePercent(id,score);
  /* Exploration is primarily a star/collection loop; learning activities remain the main XP source. */
  if(id.startsWith('exploration-'))return 18+Math.round(percent*7);
  if(id==='math-arithmetic'||id==='library-vocabulary'||id==='vocabulary')return 28+Math.round(percent*12);
  if(id==='riddle-demo'||id==='riddle')return 25+Math.round(percent*10);
  return 24+Math.round(percent*10);
}

export function standardActivityStars(activityId,score){
  if(!['math-arithmetic','vocabulary','library-vocabulary'].includes(String(activityId||'')))return 0;
  return activityScorePercent(activityId,score)>=0.8?2:1;
}
