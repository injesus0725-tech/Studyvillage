const fs=require('fs');
const assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8');
assert.ok(/\['score_corrections','score_alert_reviews','score_ledger','star_ledger','activity_records'/.test(server),'restore must clear stale star ledger before rebuilding player/settings data');
assert.ok(server.includes("compat:stars:"),'star mirror settings must remain part of the restore compatibility path');
console.log('restore star ledger reset contract self-test passed');
