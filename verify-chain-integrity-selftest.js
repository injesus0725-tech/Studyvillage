const fs=require('fs');
const path=require('path');
const assert=require('assert');

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const verify=String(pkg?.scripts?.verify||'');
const commands=verify.split('&&').map(v=>v.trim()).filter(Boolean);
assert.ok(commands.length>20,'verify chain unexpectedly short');

const duplicates=commands.filter((cmd,i)=>commands.indexOf(cmd)!==i);
assert.deepStrictEqual(duplicates,[],'verify chain must not execute the same command twice');

const critical='node runtime-critical-extra-selftests.js';
assert.strictEqual(commands.filter(v=>v===critical).length,1,'runtime critical extra selftests must run exactly once');

const runner=fs.readFileSync('runtime-critical-extra-selftests.js','utf8');
const files=[...runner.matchAll(/'([^']+selftest\.js)'/g)].map(m=>m[1]);
assert.ok(files.length>=5,'critical runtime runner unexpectedly empty');
assert.strictEqual(new Set(files).size,files.length,'critical runtime runner contains duplicate tests');
for(const file of files)assert.ok(fs.existsSync(path.resolve(file)),`critical runtime selftest missing: ${file}`);

console.log('verify chain integrity self-test passed');
