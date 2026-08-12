const fs=require('fs');
const assert=require('assert');

const source=fs.readFileSync('server/server.js','utf8');
assert.match(
  source,
  /installStarLedgerRoutes\(app,\{requireSession,requireAdmin\}\)/,
  'server must pass both student and admin auth guards into star ledger routes'
);

console.log('server star ledger auth wiring contract: ok');
