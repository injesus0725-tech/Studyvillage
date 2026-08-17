import assert from 'node:assert/strict';
import { SEMESTER_REWARD_TARGET, activityScorePercent, activityXpReward, standardActivityStars } from './server/reward-economy.js';

assert.deepEqual(SEMESTER_REWARD_TARGET,{activeDays:90,averageActivitiesPerDay:4.5,targetLevel:70,targetXp:131100});
assert.equal(activityScorePercent('riddle',800),0.8);
assert.equal(activityScorePercent('vocabulary',80),0.8);
assert.equal(activityXpReward('vocabulary',0),280);
assert.equal(activityXpReward('vocabulary',80),324);
assert.equal(activityXpReward('vocabulary',100),335);
assert.equal(activityXpReward('riddle',800),324);
assert.equal(activityXpReward('riddle',1000),335);
assert.equal(activityXpReward('vocabulary',80)*SEMESTER_REWARD_TARGET.activeDays*SEMESTER_REWARD_TARGET.averageActivitiesPerDay,131220);
assert.equal(standardActivityStars('math-arithmetic',60),1);
assert.equal(standardActivityStars('math-arithmetic',80),2);
assert.equal(standardActivityStars('vocabulary',100),2);
assert.equal(standardActivityStars('exploration-forest-riddle',100),0);

console.log('90-day Lv.70 semester reward economy contract self-test passed');
