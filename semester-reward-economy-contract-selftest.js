import assert from 'node:assert/strict';
import { SEMESTER_REWARD_TARGET, activityScorePercent, activityXpReward, standardActivityStars } from './server/reward-economy.js';

assert.deepEqual(SEMESTER_REWARD_TARGET,{activeDays:90,averageActivitiesPerDay:4.5,targetLevel:70,targetXp:131100});
assert.equal(activityScorePercent('riddle',800),0.8);
assert.equal(activityScorePercent('vocabulary',80),0.8);
assert.equal(activityXpReward('vocabulary',0),12);
assert.equal(activityXpReward('vocabulary',20),30);
assert.equal(activityXpReward('vocabulary',40),65);
assert.equal(activityXpReward('vocabulary',80),168);
assert.equal(activityXpReward('vocabulary',100),232);
assert.equal(activityXpReward('riddle',200),30);
assert.equal(activityXpReward('riddle',800),168);
assert.equal(activityXpReward('riddle',1000),232);
assert.ok(activityXpReward('vocabulary',20)<activityXpReward('vocabulary',100)*0.15,'one correct answer out of five must award far less XP than a perfect result');
assert.equal(standardActivityStars('math-arithmetic',60),1);
assert.equal(standardActivityStars('math-arithmetic',80),2);
assert.equal(standardActivityStars('vocabulary',100),2);
assert.equal(standardActivityStars('exploration-forest-riddle',100),0);

console.log('90-day Lv.70 semester reward economy contract self-test passed');
