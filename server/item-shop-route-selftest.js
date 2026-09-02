import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { installItemShopRoutes,configureShop,purchaseItem,adminShopState,resolveDeliveryRequest } from './item-shop.js';

function fakeApp(){
  const routes=[];
  const app={};
  for(const method of ['get','post','put','delete']){
    app[method]=(path,...handlers)=>{routes.push({method,path,handlers});};
  }
  return{app,routes};
}

const requireSession=(_req,_res,next)=>next?.();
const requireAdmin=(_req,_res,next)=>next?.();
const {app,routes}=fakeApp();
installItemShopRoutes(app,{requireSession,requireAdmin});

const installed=new Set(routes.map(route=>`${route.method.toUpperCase()} ${route.path}`));
for(const expected of [
  'GET /api/shop',
  'POST /api/shop/purchase',
  'PUT /api/shop/equipment',
  'GET /api/admin/shop',
  'PUT /api/admin/shop',
  'POST /api/admin/shop/delivery/:id/complete',
  'POST /api/admin/shop/delivery/:id/refund',
  'DELETE /api/admin/player/:name'
]) assert.ok(installed.has(expected),`missing route: ${expected}`);

assert.equal(routes.find(route=>route.path==='/api/shop')?.handlers[0],requireSession,'student shop route must use student session auth');
assert.equal(routes.find(route=>route.path==='/api/admin/shop')?.handlers[0],requireAdmin,'teacher shop route must use admin auth');
assert.equal(routes.find(route=>route.path==='/api/admin/shop/delivery/:id/complete')?.handlers[0],requireAdmin,'delivery completion must use admin auth');
assert.equal(routes.find(route=>route.path==='/api/admin/shop/delivery/:id/refund')?.handlers[0],requireAdmin,'delivery refund must use admin auth');
assert.equal(routes.find(route=>route.method==='delete'&&route.path==='/api/admin/player/:name')?.handlers[0],requireAdmin,'student delete cleanup middleware must use admin auth');

const shopSource=fs.readFileSync(new URL('./item-shop.js',import.meta.url),'utf8');
for(const prefix of ['compat:stars:','compat:base-character:','compat:owned-items:'])assert.ok(shopSource.includes(prefix),`student delete cleanup must cover ${prefix}`);
assert.match(shopSource,/res\.on\('finish',[\s\S]*res\.statusCode>=200&&res\.statusCode<300[\s\S]*cleanupDeletedPlayerCompatibility/,'compatibility cleanup must run only after successful student deletion');
assert.ok(shopSource.includes("'candy':5")&&shopSource.includes("'stationery':15"),'physical shop defaults must include candy and stationery');
assert.ok(shopSource.includes("fulfillment:'teacher-delivery'"),'physical purchase must be identified as teacher delivery');
assert.ok(shopSource.includes("'physical-item-refund'"),'teacher cancellation must create an auditable star refund');
assert.ok(shopSource.includes("if(!cols.includes('level'))db.exec('ALTER TABLE players ADD COLUMN level INTEGER NOT NULL DEFAULT 1')"),'shop must migrate the real XP-based player schema before querying level');
assert.ok(shopSource.includes("if(cols.includes('xp'))"),'shop must synchronize compatibility level from XP when XP exists');

const starLedgerSource=fs.readFileSync(new URL('./star-ledger.js',import.meta.url),'utf8');
assert.match(starLedgerSource,/installStarLedgerRoutes\(app,\{requireSession,requireAdmin,publishLiveEvent\}\)/,'star ledger installer must accept both auth guards and the bounded live-event publisher');
assert.match(starLedgerSource,/installItemShopRoutes\(app,\{requireSession,requireAdmin,publishLiveEvent\}\)/,'star ledger installer must pass both auth guards and the bounded live-event publisher to item shop');
assert.match(starLedgerSource,/import \{ installRestoreValidationMiddleware \} from '\.\/restore-validation-middleware\.js';/,'star ledger must import restore validation middleware');
assert.match(starLedgerSource,/installRestoreValidationMiddleware\(app,\{requireAdmin\}\)/,'restore validation middleware must be installed before legacy restore route registration');

const serverSource=fs.readFileSync(new URL('./server.js',import.meta.url),'utf8');
assert.match(serverSource,/installStarLedgerRoutes\(app,\{requireSession,requireAdmin,publishLiveEvent\}\)/,'server must pass both auth guards and the bounded live-event publisher into star ledger routes');

const previousDataDir=process.env.STUDYVILLAGE_DATA_DIR;
const tempDir=fs.mkdtempSync(path.join(os.tmpdir(),'studyvillage-shop-'));
process.env.STUDYVILLAGE_DATA_DIR=tempDir;
try{
  const db=new Database(path.join(tempDir,'studyvillage.db'));
  db.exec(`CREATE TABLE settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);CREATE TABLE players(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL UNIQUE,xp INTEGER NOT NULL DEFAULT 0,stars INTEGER NOT NULL DEFAULT 0,owned_items_json TEXT NOT NULL DEFAULT '[]',equipment_json TEXT NOT NULL DEFAULT '{}',updated_at TEXT NOT NULL);`);
  db.prepare('INSERT INTO players(name,xp,stars,owned_items_json,equipment_json,updated_at) VALUES(?,?,?,?,?,?)').run('테스트학생',240,100,JSON.stringify(['old-test-outfit']),JSON.stringify({outfit:'old-test-outfit'}),new Date().toISOString());
  db.prepare('INSERT INTO players(name,xp,stars,owned_items_json,equipment_json,updated_at) VALUES(?,?,?,?,?,?)').run('펫정리학생',0,100,JSON.stringify(['pet-penguin','pet-dog','pet-maltese-production']),JSON.stringify({pet:'pet-penguin'}),new Date().toISOString());
  db.prepare('INSERT INTO settings(key,value) VALUES(?,?)').run('avatar:four-slot-production-reset:v2',new Date().toISOString());
  db.prepare('INSERT INTO settings(key,value) VALUES(?,?)').run('avatar:removed-legacy-slots:v3',new Date().toISOString());
  db.prepare('INSERT INTO settings(key,value) VALUES(?,?)').run(`compat:owned-items:${encodeURIComponent('펫정리학생')}`,JSON.stringify(['pet-penguin','pet-dog','pet-maltese-production']));
  db.close();
  assert.equal(configureShop({enabled:true}).ok,true,'test shop should enable against the real XP-based player schema');
  const cleanupDb=new Database(path.join(tempDir,'studyvillage.db'),{readonly:true});
  const cleaned=cleanupDb.prepare('SELECT owned_items_json,equipment_json FROM players WHERE name=?').get('펫정리학생');
  assert.deepEqual(JSON.parse(cleaned.owned_items_json),[],'new art migration must clear every tester purchase');
  assert.deepEqual(JSON.parse(cleaned.equipment_json),{},'new art migration must clear every equipped tester item');
  assert.equal(cleanupDb.prepare('SELECT value FROM settings WHERE key=?').get(`compat:owned-items:${encodeURIComponent('펫정리학생')}`),undefined,'legacy wardrobe mirror must be removed');
  assert.equal(cleanupDb.prepare('SELECT stars FROM players WHERE name=?').get('펫정리학생').stars,0,'tester star balances must reset with purchases');
  cleanupDb.close();
  const migratedDb=new Database(path.join(tempDir,'studyvillage.db'),{readonly:true});
  assert.equal(migratedDb.prepare('SELECT xp FROM players WHERE name=?').get('테스트학생').xp,240,'new art migration must preserve learning XP');
  assert.equal(migratedDb.prepare('SELECT level FROM players WHERE name=?').get('테스트학생').level,2,'shop compatibility level should be derived from preserved XP');
  migratedDb.close();
  const refillDb=new Database(path.join(tempDir,'studyvillage.db'));
  refillDb.prepare('UPDATE players SET stars=100 WHERE name=?').run('테스트학생');
  refillDb.close();
  const purchase=purchaseItem('테스트학생','candy');
  assert.equal(purchase.ok,true,'physical purchase should succeed');
  assert.equal(purchase.fulfillment,'teacher-delivery');
  assert.equal(purchase.balance,95,'stars must be deducted immediately');
  const pending=adminShopState().deliveryRequests.find(row=>row.id===purchase.deliveryRequestId);
  assert.equal(pending?.status,'pending','teacher must receive a pending delivery request');
  const refund=resolveDeliveryRequest(purchase.deliveryRequestId,'refund');
  assert.equal(refund.ok,true,'teacher cancellation should refund');
  assert.equal(refund.balance,100,'refund must restore deducted stars');
  assert.equal(resolveDeliveryRequest(purchase.deliveryRequestId,'refund').ok,false,'refund must not run twice');
  const second=purchaseItem('테스트학생','stationery');
  assert.equal(second.ok,true,'stationery delivery request should succeed');
  const delivered=resolveDeliveryRequest(second.deliveryRequestId,'delivered');
  assert.equal(delivered.ok,true,'teacher should mark delivery complete');
  const verifyDb=new Database(path.join(tempDir,'studyvillage.db'),{readonly:true});
  assert.equal(verifyDb.prepare('SELECT stars FROM players WHERE name=?').get('테스트학생').stars,85,'delivery completion must not refund stars');
  assert.equal(verifyDb.prepare("SELECT COUNT(*) AS count FROM star_ledger WHERE player_name=? AND kind='physical-item-refund'").get('테스트학생').count,1,'refund must be written once to star ledger');
  verifyDb.close();
}finally{
  if(previousDataDir===undefined)delete process.env.STUDYVILLAGE_DATA_DIR;else process.env.STUDYVILLAGE_DATA_DIR=previousDataDir;
  fs.rmSync(tempDir,{recursive:true,force:true});
}

console.log('item shop route + physical fulfillment contract: ok');
