const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const packaged=new Set(pkg.build?.files||[]);
const localScripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(match=>match[1]).filter(path=>!path.includes('/'));
const missing=localScripts.filter(path=>!packaged.has(path));
assert.deepStrictEqual(missing,[],`Windows package is missing student scripts: ${missing.join(', ')}`);
for(const path of localScripts)assert.ok(fs.existsSync(path),`student page references a missing source file: ${path}`);
console.log('packaged student script coverage contract self-test passed');
