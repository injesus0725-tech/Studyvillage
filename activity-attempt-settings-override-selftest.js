import assert from 'node:assert/strict';
import { readActivityAttemptPolicies } from './server/activity-attempt-settings.js';

const key='activity-attempt-policies:v1';
const saved={
  'math-arithmetic':{mode:'limited',limit:7,xpMode:'first-completion'},
  'library-vocabulary':{mode:'unlimited',xpMode:'first-completion'},
  'exploration-forest-riddle':{mode:'limited',limit:2,xpMode:'every-attempt'}
};
const policies=readActivityAttemptPolicies(name=>name===key?JSON.stringify(saved):null);
assert.equal(policies['math-arithmetic'].limit,7,'teacher math limit must override classroom default');
assert.equal(policies['math-arithmetic'].xpMode,'first-completion');
assert.equal(policies['math-arithmetic'].period,'daily','math classroom cadence stays daily');
assert.equal(policies['library-vocabulary'].mode,'unlimited','teacher Bookmaru mode must override classroom default');
assert.equal(policies['library-vocabulary'].period,'daily','Bookmaru classroom cadence stays daily');
assert.equal(policies['exploration-forest-riddle'].limit,2,'exploration teacher policy must persist');
assert.equal(policies['exploration-forest-riddle'].period,undefined);
console.log('activity attempt settings override selftest passed');
