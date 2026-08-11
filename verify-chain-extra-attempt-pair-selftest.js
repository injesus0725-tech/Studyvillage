const fs=require('fs');
const assert=require('assert');

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const verify=String(pkg?.scripts?.verify||'');

assert.ok(verify,'verify script is required');
assert.ok(
  verify.includes('node admin-extra-attempt-grant-contract-pair-selftest.js'),
  'extra attempt contract pair must stay in verify'
);

console.log('verify chain extra attempt pair self-test passed');
