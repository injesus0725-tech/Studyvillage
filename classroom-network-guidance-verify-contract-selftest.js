/* v1.9 verify wiring contract for classroom network guidance.
   Read-only: ensures the guidance selftest remains part of npm run verify. */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const pkg=JSON.parse(fs.readFileSync(new URL('./package.json',import.meta.url),'utf8'));
const verify=String(pkg?.scripts?.verify||'');

assert.ok(verify,'package.json: verify script required');
assert.ok(
  verify.includes('node classroom-network-guidance-contract-selftest.js'),
  'verify must run classroom-network-guidance-contract-selftest.js'
);

console.log('classroom network guidance verify contract: ok');
