/* Classroom reward economy: eight daily activities should produce an early level
   roughly every two days, then slow naturally as the level spans grow. */
export const SEMESTER_REWARD_TARGET=Object.freeze({activeDays:90,averageActivitiesPerDay:8,targetLevel:70,targetXp:131100,earlyLevelActivities:16});

export function activityScorePercent(activityId,score){
  const maximum=activityId==='riddle'||activityId==='riddle-demo'?1000:100;
  return Math.max(0,Math.min(1,(Number(score)||0)/maximum));
}

export function activityXpReward(activityId,score){
  const rate=activityScorePercent(activityId,score);
  const exploration=String(activityId||'').startsWith('exploration-');
  /* Regular activity: 2/3/5/7/9/11 XP at 0/20/40/60/80/100%.
     Exploration is intentionally richer: 4/5/8/10/13/16 XP before its small event bonus. */
  return exploration?4+Math.round(12*Math.pow(rate,1.32)):2+Math.round(9*Math.pow(rate,1.28));
}

export function standardActivityStars(activityId,score){
  if(!['math-arithmetic','vocabulary'].includes(String(activityId||'')))return 0;
  const rate=activityScorePercent(activityId,score);
  if(rate<=0)return 0;
  return rate>=0.8?2:1;
}
