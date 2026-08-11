import assert from 'node:assert/strict';
import { readExtraAttempts, setExtraAttempts, grantExtraAttempts } from './activity-attempt-exceptions.js';

const store=new Map();
const getSetting=key=>store.get(key)??null;
const setSetting=(key,value)=>store.set(key,String(value));

assert.equal(readExtraAttempts(getSetting,'가람','riddle-demo'),0);
assert.deepEqual(grantExtraAttempts(getSetting,setSetting,'가람','riddle-demo',1),{ok:true,name:'가람',activityId:'riddle-demo',extraAttempts:1});
assert.equal(readExtraAttempts(getSetting,'가람','riddle-demo'),1);
assert.deepEqual(grantExtraAttempts(getSetting,setSetting,'가람','riddle-demo',1),{ok:true,name:'가람',activityId:'riddle-demo',extraAttempts:2});
assert.equal(readExtraAttempts(getSetting,'가람','riddle-demo'),2);
assert.equal(setExtraAttempts(setSetting,'가람','riddle-demo',1000).ok,true);
assert.equal(grantExtraAttempts(getSetting,setSetting,'가람','riddle-demo',1).extraAttempts,1000);
assert.equal(setExtraAttempts(setSetting,'가람','riddle-demo',-1).ok,false);
assert.equal(grantExtraAttempts(getSetting,setSetting,'가람','riddle-demo',0).ok,false);
assert.equal(grantExtraAttempts(getSetting,setSetting,'가람','bad id',1).ok,false);
assert.equal(setExtraAttempts(setSetting,'','riddle-demo',1).ok,false);
console.log('activity attempt exceptions selftest: ok');
