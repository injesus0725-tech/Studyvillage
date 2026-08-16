const fs=require('fs'),assert=require('assert');
const gate=fs.readFileSync('activity-gate.js','utf8');
const math=fs.readFileSync('math-practice.js','utf8');

assert.ok(gate.includes("const unavailable={ok:false,message:`📡 ${name}의 남은 도전 횟수를 확인할 수 없어요."),'controlled activities must explain an unavailable allowance check');
assert.ok(gate.includes('if(!response.ok)return unavailable')&&gate.includes('if(!status.ok)return unavailable'),'HTTP and malformed status failures must stop activity entry');
assert.ok(gate.includes('catch{return unavailable}'),'a timeout or network failure must not fail open');
assert.ok(!gate.includes('catch{return{ok:true}}'),'students must not start an attempt that may be rejected only after completion');
assert.ok(math.includes("const allowance=await fetchJson('/api/player/me/activity-attempt-status/'+ID)")&&math.includes("catch{alert('수학 문제를 준비하지 못했어요."),'math entry must also stop when its allowance cannot be confirmed');
console.log('student attempt status fail-closed contract self-test passed');
