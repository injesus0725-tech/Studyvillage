import assert from 'node:assert/strict';
import { SEMESTER_REWARD_TARGET, activityScorePercent, activityXpReward, standardActivityStars } from './server/reward-economy.js';

assert.deepEqual(SEMESTER_REWARD_TARGET,{activeDays:90,averageActivitiesPerDay:4.5,targetLevel:20,targetXp:13100});
assert.equal(activityScorePercent('riddle',800),0.8);
assert.equal(activityScorePercent('vocabulary',80),0.8);
assert.equal(activityXpReward('vocabulary',0),28);
assert.equal(activityXpReward('vocabulary',80),38);
assert.equal(activityXpReward('vocabulary',100),40);
assert.equal(activityXpReward('riddle',800),33);
assert.equal(activityXpReward('riddle',1000),35);
const projectedXp=activityXpReward('vocabulary',80)*SEMESTER_REWARD_TARGET.activeDays*SEMESTER_REWARD_TARGET.averageActivitiesPerDay;
assert.ok(projectedXp>=SEMESTER_REWARD_TARGET.targetXp,'typical semester participation should be sufficient to reach the target level without requiring perfect scores');
assert.ok(projectedXp<SEMESTER_REWARD_TARGET.targetXp*1.3,'typical semester participation should not overshoot the stabilized level curve excessively');
assert.equal(standardActivityStars('math-arithmetic',60),1);
assert.equal(standardActivityStars('math-arithmetic',80),2);
assert.equal(standardActivityStars('vocabulary',100),2);
assert.equal(standardActivityStars('exploration-forest-riddle',100),0);

console.log('90-day Lv.20 stabilized semester reward economy contract self-test passed');
