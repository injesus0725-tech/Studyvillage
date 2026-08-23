/* Semester reward economy: 90 active days, about 4.5 completed activities per day, Lv.70 target.
   Accuracy now matters much more than simply finishing an activity. */
export const SEMESTER_REWARD_TARGET=Object.freeze({activeDays:90,averageActivitiesPerDay:4.5,targetLevel:70,targetXp:131100});

export function activityScorePercent(activityId,score){
  const maximum=activityId==='riddle'||activityId==='riddle-demo'?1000:100;
  return Math.max(0,Math.min(1,(Number(score)||0)/maximum));
}

export function activityXpReward(activityId,score){
  const rate=activityScorePercent(activityId,score);
  /* Small completion XP + strongly accuracy-weighted learning XP.
     0%=12, 20%=30, 40%=63, 60%=109, 80%=166, 100%=232 before the early-level growth adjustment. */
  return 12+Math.round(220*Math.pow(rate,1.55));
}

export function standardActivityStars(activityId,score){
  if(!['math-arithmetic','vocabulary'].includes(String(activityId||'')))return 0;
  const rate=activityScorePercent(activityId,score);
  if(rate<=0)return 0;
  return rate>=0.8?2:1;
}
