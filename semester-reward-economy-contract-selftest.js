import assert from 'node:assert/strict';
import { SEMESTER_REWARD_TARGET, activityScorePercent, activityXpReward, standardActivityStars } from './server/reward-economy.js';

assert.deepEqual(SEMESTER_REWARD_TARGET,{activeDays:90,averageActivitiesPerDay:8,targetLevel:70,targetXp:131100,earlyLevelActivities:16});
assert.equal(activityScorePercent('riddle',800),0.8);
assert.equal(activityScorePercent('vocabulary',80),0.8);
assert.equal(activityXpReward('vocabulary',0),2);
assert.equal(activityXpReward('vocabulary',20),3);
assert.equal(activityXpReward('vocabulary',40),5);
assert.equal(activityXpReward('vocabulary',80),9);
assert.equal(activityXpReward('vocabulary',100),11);
assert.equal(activityXpReward('riddle',200),3);
assert.equal(activityXpReward('riddle',800),9);
assert.equal(activityXpReward('riddle',1000),11);
assert.equal(activityXpReward('exploration-forest-riddle',0),4);
assert.equal(activityXpReward('exploration-forest-riddle',100),16);
assert.ok(activityXpReward('vocabulary',20)<activityXpReward('vocabulary',100),'low accuracy must still award clearly less XP than a perfect result');
assert.equal(standardActivityStars('math-arithmetic',60),1);
assert.equal(standardActivityStars('math-arithmetic',80),1);
assert.equal(standardActivityStars('math-arithmetic',40),0);
assert.equal(standardActivityStars('vocabulary',100),2);
assert.equal(standardActivityStars('curriculum-integrated',100),2);
assert.equal(standardActivityStars('exploration-forest-riddle',100),0);

console.log('90-day Lv.70 semester reward economy contract self-test passed');
