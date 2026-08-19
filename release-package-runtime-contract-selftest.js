const fs=require('fs'),assert=require('assert');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const files=new Set(pkg?.build?.files||[]);
const required=['index.html','admin.html','connect.html','student-direct-movement.js','STABILIZATION_DEVICE_CHECKLIST.md','CLASSROOM-QUICKSTART.txt'];
for(const file of required)assert.ok(files.has(file),`packaged release must include ${file}`);

function isPackaged(file){
  if(file.startsWith('assets/'))return files.has('assets/**/*');
  if(file.startsWith('server/'))return files.has('server/**/*');
  if(file.startsWith('electron/'))return files.has('electron/**/*');
  return files.has(file);
}
function checkHtml(path){
  const html=fs.readFileSync(path,'utf8');
  for(const match of html.matchAll(/<script\s+src="([^"?]+)(?:\?[^" ]*)?"/g)){
    const file=match[1];
    assert.ok(isPackaged(file),`${path}: packaged release must include runtime script ${file}`);
  }
  for(const match of html.matchAll(/<link[^>]+href="([^"?]+)(?:\?[^" ]*)?"/g)){
    const file=match[1];
    assert.ok(isPackaged(file),`${path}: packaged release must include stylesheet ${file}`);
  }
}
for(const path of ['index.html','admin.html','connect.html'])checkHtml(path);

const main=String(pkg.main||'');
assert.ok(main&&isPackaged(main),`packaged release must include Electron entry ${main}`);
console.log('release package runtime contract self-test passed');
