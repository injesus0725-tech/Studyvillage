const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('admin.html','utf8'),fix=fs.readFileSync('assets/admin-runtime-fixes.js','utf8');
assert.ok(html.includes('assets/admin-runtime-fixes.js'),'teacher runtime fixes must actually load in admin page');
for(const action of ['reset-password','/xp','custom-title','/rename','reset-equipment'])assert.ok(fix.includes(action),`${action} teacher write action must be covered`);
assert.ok(fix.includes("setTimeout(()=>controller.abort(),7000)"),'teacher writes must fail visibly instead of hanging forever');
assert.ok(fix.includes("event.stopImmediatePropagation()"),'stabilized teacher write handler must prevent duplicate legacy writes');
assert.ok(fix.includes("sessionStorage.removeItem('studyvillage-admin-token')"),'expired admin login must be cleared');
console.log('teacher runtime fixes load self-test passed');
