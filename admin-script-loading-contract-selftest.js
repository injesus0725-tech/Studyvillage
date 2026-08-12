const fs=require('fs');
const assert=require('assert');

const html=fs.readFileSync('admin.html','utf8');
const adminFiles=[...html.matchAll(/<script\s+src="([^"]+\.js)"/g)].map(m=>m[1]);
const duplicates=adminFiles.filter((file,index)=>adminFiles.indexOf(file)!==index);
assert.deepStrictEqual(duplicates,[],'admin.html must not load the same script more than once');

const listed=new Set(adminFiles);
for(const file of adminFiles.filter(x=>x.startsWith('admin-'))){
  if(!fs.existsSync(file))continue;
  const src=fs.readFileSync(file,'utf8');
  for(const match of src.matchAll(/\.src\s*=\s*['"]([^'"]+\.js)['"]/g)){
    const injected=match[1];
    assert.ok(!listed.has(injected),`${file} dynamically injects ${injected}, which admin.html already loads`);
  }
}

console.log('admin script loading contract self-test passed');
