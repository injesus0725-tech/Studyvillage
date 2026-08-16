const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),admin=fs.readFileSync('admin-student-edit.js','utf8');
assert.ok(server.includes("app.post('/api/admin/player/:name/reset-equipment',requireAdmin"),'equipment repair must require administrator authentication');
assert.ok(server.includes("reason.length<3||reason.length>200"),'equipment repair must require a bounded reason');
assert.ok(server.includes("SET base_character='student-default',equipment_json='{}'"),'repair must reset only the equipped appearance');
assert.ok(server.includes('ownedItemsPreserved:true,starsPreserved:true,xpPreserved:true'),'repair response must declare preserved reward boundaries');
assert.ok(server.includes("logActivity(name,'equipment-repair'")&&server.includes('const result=db.transaction'),'equipment reset and audit event must be atomic');
assert.ok(admin.includes('보유 아이템·별·XP·점수는 삭제되지 않습니다.')&&admin.includes('data-equipment-name'),'teacher UI must explain and expose the safe repair boundary');
console.log('admin equipment repair contract selftest passed');
