const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),admin=fs.readFileSync('admin-student-edit.js','utf8');
assert.ok(server.includes("app.get('/api/admin/student-change-history',requireAdmin"),'student change history must require administrator authentication');
for(const type of ['xp-correction','activity-record-correction','equipment-repair','account-renamed','teacher-item-grant'])assert.ok(server.includes(type),`history must include ${type}`);
assert.ok(server.includes("kind='teacher-item-grant'")&&server.includes('changes.sort'),'item grant ledger entries must merge chronologically with activity changes');
assert.ok(admin.includes('학생 기록 교정·복구 이력')&&admin.includes("fetch('/api/admin/student-change-history'"),'teacher must receive a dedicated change history panel');
assert.ok(admin.includes('escapeHtml(change.playerName)')&&admin.includes("escapeHtml(change.detail||'')"),'student names and reasons must render as text-safe HTML');
assert.ok(admin.includes("#refresh-button,#admin-login-button")&&admin.includes('loadChangeHistory'),'history must refresh after login and manual refresh');
console.log('admin student change history contract selftest passed');
