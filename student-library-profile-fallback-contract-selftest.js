const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/activity-attempt-student.js','utf8');
const library=fs.readFileSync('library-game.js','utf8');
const sync=fs.readFileSync('student-result-profile-sync.js','utf8');

assert.ok(server.includes('res.json(result)'),'generic activity saves may return a record without embedding the full player');
assert.ok(library.includes('player:result.player'),'the library completion event must tolerate an optional embedded player');
assert.ok(sync.includes('const player=event.detail?.player')&&sync.includes('else refreshConfirmedPlayer();'),'missing embedded player data must trigger a confirmed server profile refresh');
assert.ok(sync.includes("fetch('/api/player/me'")&&sync.includes("headers:window.StudyVillageAuth?.authHeaders?.()||{}"),'fallback refresh must use the active student session');
console.log('student library profile fallback contract self-test passed');
