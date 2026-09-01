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

const selfTestPath='server/admin-error-selftest.js';
assert.ok(adminFiles.includes(selfTestPath),'admin error self-test must load from the packaged server asset path');
assert.ok(fs.existsSync(selfTestPath),'admin error self-test asset must exist');
const selfTest=fs.readFileSync(selfTestPath,'utf8');
assert.ok(selfTest.includes("request('/api/login'"),'self-test must create a temporary student session');
assert.ok(selfTest.includes("request('/api/error-report'"),'self-test must submit a real student error report');
assert.ok(selfTest.includes("request('/api/admin/errors'"),'self-test must verify persistence through the admin API');
assert.ok(selfTest.includes("method:'DELETE'"),'self-test must clean up its temporary student and error report');
assert.ok(selfTest.includes('reportId===reportId')&&selfTest.includes("row.kind==='self-test'"),'self-test must verify the exact synthetic report');

console.log('admin script loading contract self-test passed');
