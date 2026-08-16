const assert=require('assert');
const fs=require('fs');
const server=fs.readFileSync('server/star-ledger.js','utf8'),client=fs.readFileSync('admin-exploration-collections.js','utf8'),html=fs.readFileSync('admin.html','utf8');

assert.match(server,/app\.get\('\/api\/admin\/exploration-collections',requireAdmin/,'class collection overview must require administrator authentication');
assert.match(server,/SELECT name FROM players ORDER BY name COLLATE NOCASE/,'overview must include every current student');
assert.match(client,/이 화면에서는 도감 내용을 수정하지 않습니다/,'teacher collection overview must be explicitly read-only');
assert.match(client,/controller\.abort\(\),5000/,'admin collection request must not hang');
assert.match(client,/response\.status===401/,'expired administrator sessions must be handled');
assert.match(client,/npcCount\+eventCount/,'overview must calculate collection progress from both categories');
assert.match(client,/total===9\?'🏆 도감 완성'/,'completed collections must be easy to identify');
assert(html.includes('<script src="admin-exploration-collections.js"></script>'),'admin collection overview must load');
console.log('admin exploration collection contract selftest passed');
