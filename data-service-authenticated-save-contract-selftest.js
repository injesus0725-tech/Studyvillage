const fs=require('fs'),assert=require('assert');
const src=fs.readFileSync('data-service.js','utf8');
assert.ok(src.includes('if(headers.Authorization)return true'),'authenticated classroom sessions must attempt the real server even if a health probe is stale');
assert.ok(!src.includes("if(!(await window.StudyVillageAuth.checkServer()))return false"),'data writes must not be demoted to local mode solely by a transient health miss');
assert.ok(src.includes("timedFetch('/api/player/me/record'"),'confirmed score saves must still target the classroom server');
console.log('data service authenticated save contract self-test passed');
