const fs=require('fs'),assert=require('assert');
const gate=fs.readFileSync('activity-gate.js','utf8');
const math=fs.readFileSync('math-practice.js','utf8');

assert.ok(gate.includes("return`📡 ${name}의 남은 도전 횟수를 확인할 수 없어요."),'controlled activities must explain an unavailable allowance check');
assert.ok(gate.includes("if(!response.ok||!data.ok)return{ok:false"),'HTTP and malformed status failures must stop activity entry with a structured failure');
assert.ok(gate.includes("const code=error?.name==='AbortError'?'request-timeout':'network-error'")&&gate.includes("return{ok:false,code,status:0,message:errorMessage(name,0,code)}"),'a timeout or network failure must fail closed with an explainable error category');
assert.ok(!gate.includes('catch{return{ok:true}}'),'students must not start an attempt that may be rejected only after completion');
assert.ok(math.includes("const allowance=await fetchJson('/api/player/me/activity-attempt-status/'+ID)"),'math entry must confirm its remaining allowance before starting');
assert.ok(math.includes('if(!allowance.allowed)'),'math entry must stop when the daily allowance is exhausted');
const start=math.slice(math.indexOf('async function start()'),math.indexOf('async function next()'));
assert.ok(start.includes("catch{alert('수학")&&start.includes('문제를 준비하지 못했어요.'),'math entry must also stop and explain when its allowance cannot be confirmed');
assert.ok(!start.includes('catch{}'),'math start failures must not be silently ignored');
console.log('student attempt status fail-closed contract self-test passed');
