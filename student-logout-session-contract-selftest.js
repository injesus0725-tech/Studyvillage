const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),auth=fs.readFileSync('auth.js','utf8'),session=fs.readFileSync('student-session.js','utf8'),pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
assert.match(server,/app\.post\('\/api\/logout',requireSession/,'logout must require the current student session');
assert.ok(server.includes('sessions.delete(token)')&&server.includes('presence.delete(name)'),'logout must remove the server token and stale presence');
assert.ok(auth.includes("timedFetch('/api/logout'")&&auth.includes("method:'POST'")&&auth.includes('Authorization:`Bearer ${token}`'),'logout must revoke the authenticated server token');
assert.ok(auth.includes("},2000)}catch{}}clearSession()"),'logout must be bounded and still clear local state when the server is unavailable');
assert.equal((session.match(/await window\.StudyVillageAuth\.logoutSession\(\);/g)||[]).length,2,'student switch and explicit exit must both revoke the session');
assert.ok(pkg.build.files.includes('student-single-session.js'),'single-device enforcement must be included in the Windows package');
console.log('student logout session contract self-test passed');
