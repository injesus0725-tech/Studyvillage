const fs=require('fs');
const assert=require('assert');

const source=fs.readFileSync('server/server.js','utf8');
assert.match(
  source,
  /installStarLedgerRoutes\(app,\{requireSession,requireAdmin,publishLiveEvent\}\)/,
  'server must pass student/admin auth guards and the bounded event publisher into star ledger routes'
);

console.log('server star ledger auth wiring contract: ok');
