const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-student.js','utf8');
assert.ok(src.includes("function submissionIdOf(value){const id=clean(value,100);return /^[A-Za-z0-9._:-]{8,100}$/.test(id)?id:''}"),'submission id must be validated before cache use');
assert.ok(src.includes('const name=req.session.name,cached=cachedSubmission(name,activityId,submissionId);'),'validated submission id must feed retry lookup');
assert.ok(src.includes('if(!submissionId)return null'),'invalid submission id must disable retry-cache lookup safely');
assert.ok(/function rememberSubmission\([^)]*submissionId[^)]*\)\{if\(submissionId\)/.test(src),'invalid submission id must disable retry-cache writes safely');
assert.ok(src.includes('rememberSubmission(name,activityId,submissionId,result);'),'normal activity save must still complete when retry caching is unavailable');
console.log('activity invalid submission safe fallback contract self-test passed');
