import assert from 'node:assert/strict';
import { evaluateAttempt, normalizeAttemptPolicy, validateAttemptPolicyMap } from './activity-attempt-policy.js';

assert.deepEqual(normalizeAttemptPolicy({mode:'once',xpMode:'every-attempt'}),{mode:'once',limit:1,xpMode:'first-completion',period:'all-time'});
assert.deepEqual(evaluateAttempt({mode:'once'},{attempts:0}),{policy:{mode:'once',limit:1,xpMode:'first-completion',period:'all-time'},attempts:0,remaining:1,allowed:true,awardXp:true,completed:false});
assert.equal(evaluateAttempt({mode:'once'},{attempts:1}).allowed,false);
assert.equal(evaluateAttempt({mode:'limited',limit:3,xpMode:'first-completion'},{attempts:1}).awardXp,false);
assert.equal(evaluateAttempt({mode:'limited',limit:3,xpMode:'every-attempt',period:'daily'},{attempts:1}).policy.period,'daily');
assert.equal(evaluateAttempt({mode:'limited',limit:3,xpMode:'every-attempt'},{attempts:1}).awardXp,true);
assert.equal(evaluateAttempt({mode:'limited',limit:3,xpMode:'every-attempt'},{attempts:3}).allowed,false);
assert.equal(evaluateAttempt({mode:'unlimited',xpMode:'first-completion'},{attempts:12}).awardXp,false);
assert.equal(evaluateAttempt({mode:'unlimited',xpMode:'every-attempt'},{attempts:12}).awardXp,true);
assert.equal(validateAttemptPolicyMap({'bad id':{mode:'once'}}).ok,false);
assert.deepEqual(validateAttemptPolicyMap({'riddle-demo':{mode:'limited',limit:2,xpMode:'every-attempt',period:'daily'}}),{ok:true,policies:{'riddle-demo':{mode:'limited',limit:2,xpMode:'every-attempt',period:'daily'}}});
console.log('activity attempt policy selftest: ok');
