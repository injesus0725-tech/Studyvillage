const fs=require('fs'),assert=require('assert');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const files=new Set(pkg?.build?.files||[]);
const html=fs.readFileSync('index.html','utf8');
const required=['student-direct-movement.js','STABILIZATION_DEVICE_CHECKLIST.md'];
for(const file of required)assert.ok(files.has(file),`packaged release must include ${file}`);
for(const match of html.matchAll(/<script\s+src="([^"?]+)(?:\?[^" ]*)?"/g)){
  const file=match[1];
  if(file.startsWith('assets/'))assert.ok(files.has('assets/**/*'),`packaged release must include assets for ${file}`);
  else assert.ok(files.has(file),`packaged release must include runtime script ${file}`);
}
for(const match of html.matchAll(/<link[^>]+href="([^"?]+)(?:\?[^" ]*)?"/g)){
  const file=match[1];
  assert.ok(files.has(file),`packaged release must include stylesheet ${file}`);
}
console.log('release package runtime contract self-test passed');
