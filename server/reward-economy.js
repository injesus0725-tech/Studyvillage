/* Semester reward economy: 90 active days, about 4.5 completed activities per day, Lv.70 target. */
export const SEMESTER_REWARD_TARGET=Object.freeze({activeDays:90,averageActivitiesPerDay:4.5,targetLevel:70,targetXp:131100});

export function activityScorePercent(activityId,score){
  const maximum=activityId==='riddle'||activityId==='riddle-demo'?1000:100;
  return Math.max(0,Math.min(1,(Number(score)||0)/maximum));
}

export function activityXpReward(activityId,score){
  return 280+Math.round(activityScorePercent(activityId,score)*55);
}

export function standardActivityStars(activityId,score){
  if(!['math-arithmetic','vocabulary'].includes(String(activityId||'')))return 0;
  return activityScorePercent(activityId,score)>=0.8?2:1;
}
