import assert from 'node:assert/strict';
import fs from 'node:fs';
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
assert.equal(standardActivityStars('math-arithmetic',40),0);
assert.equal(standardActivityStars('math-arithmetic',60),1);
assert.equal(standardActivityStars('math-arithmetic',80),1);
assert.equal(standardActivityStars('vocabulary',100),2);
assert.equal(standardActivityStars('exploration-forest-riddle',40),0);
assert.equal(standardActivityStars('exploration-forest-riddle',60),1);
assert.equal(standardActivityStars('exploration-forest-riddle',100),2);

const ledger=fs.readFileSync('server/star-ledger.js','utf8');
assert.ok(ledger.includes("const isStandardLearningActivity=activityId=>/^[a-z0-9-]{1,40}$/.test(activityId)&&!activityId.startsWith('exploration-')&&activityId!=='riddle'&&activityId!=='riddle-demo'"),'all normal learning activities must use the standard star rule');
assert.ok(ledger.includes("EXPEDITION_REWARD_IDS.has(activityId)?expeditionStarsFor(activityId,score):standardActivityStars(activityId,score)"),'exploration special rewards and normal learning rewards must remain separate');
const math=fs.readFileSync('math-practice.js','utf8');
assert.ok(math.includes('const stars=Number(saved.activityStars)||0'),'math result must read awarded stars');
assert.ok(math.includes("new Event('studyvillage:stars-refresh')"),'math completion must refresh the visible star balance');
assert.ok(math.includes('XP · +${stars}별'),'math result must show the awarded stars');

console.log('90-day Lv.70 semester reward economy contract self-test passed');
