const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/star-ledger.js','utf8');

for(const token of [
  'const MAX_STARS=1000000',
  'const validStarBalance=value=>Number.isSafeInteger(value)&&value>=0&&value<=MAX_STARS',
  "if(!validStarBalance(snap.balance))throw new Error('corrupt-star-balance')",
  "if(!validStarBalance(row.stars))throw new Error('corrupt-star-balance')",
  "if(!validStarBalance(player.stars))return{ok:false,code:'corrupt-star-balance'}",
  "if(validStarBalance(live.balance)&&normalized(live)===normalized(mirror))return false"
])assert.ok(src.includes(token),`star ledger integrity guard missing: ${token}`);

const snapshotStart=src.indexOf('function liveSnapshot');
const recoverStart=src.indexOf('function recoverFromMirror');
const balanceStart=src.indexOf('export function starBalanceFor');
const changeStart=src.indexOf('export function changeStars');
assert.ok(snapshotStart>=0&&recoverStart>snapshotStart&&balanceStart>recoverStart&&changeStart>balanceStart,'star ledger functions must exist in expected order');

const snapshot=src.slice(snapshotStart,src.indexOf('function normalized',snapshotStart));
assert.ok(snapshot.includes('return{balance:row.stars,entries}'),'live snapshot must preserve raw stored balance so corruption is not silently clamped');
assert.ok(!snapshot.includes('Math.max(0'),'live snapshot must not clamp corrupt balances');

const balance=src.slice(balanceStart,src.indexOf('export function starLedgerFor',balanceStart));
assert.ok(balance.indexOf('recoverFromMirror(db,name)')<balance.indexOf('validStarBalance(row.stars)'),'balance read must allow valid mirror recovery before strict validation');
assert.ok(!balance.includes('Math.max(0'),'balance read must not clamp corrupt balances');

const change=src.slice(changeStart,src.indexOf('export function installStarLedgerRoutes',changeStart));
assert.ok(change.indexOf("if(!validStarBalance(player.stars))")<change.indexOf('const before=player.stars'),'star mutation must validate persisted balance before arithmetic');
assert.ok(!change.includes('Math.max(0,Number(player.stars)||0)'),'star mutation must not normalize corrupt persisted balances');

console.log('star ledger balance integrity contract self-test passed');
