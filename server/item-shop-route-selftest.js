import assert from 'node:assert/strict';
import fs from 'node:fs';
import { installItemShopRoutes } from './item-shop.js';

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
  'DELETE /api/admin/player/:name'
]) assert.ok(installed.has(expected),`missing route: ${expected}`);

assert.equal(routes.find(route=>route.path==='/api/shop')?.handlers[0],requireSession,'student shop route must use student session auth');
assert.equal(routes.find(route=>route.path==='/api/admin/shop')?.handlers[0],requireAdmin,'teacher shop route must use admin auth');
assert.equal(routes.find(route=>route.method==='delete'&&route.path==='/api/admin/player/:name')?.handlers[0],requireAdmin,'student delete cleanup middleware must use admin auth');

const shopSource=fs.readFileSync(new URL('./item-shop.js',import.meta.url),'utf8');
for(const prefix of ['compat:stars:','compat:base-character:','compat:owned-items:'])assert.ok(shopSource.includes(prefix),`student delete cleanup must cover ${prefix}`);
assert.match(shopSource,/res\.on\('finish',[\s\S]*res\.statusCode>=200&&res\.statusCode<300[\s\S]*cleanupDeletedPlayerCompatibility/,'compatibility cleanup must run only after successful student deletion');

const starLedgerSource=fs.readFileSync(new URL('./star-ledger.js',import.meta.url),'utf8');
assert.match(starLedgerSource,/installStarLedgerRoutes\(app,\{requireSession,requireAdmin,publishLiveEvent\}\)/,'star ledger installer must accept both auth guards and the bounded live-event publisher');
assert.match(starLedgerSource,/installItemShopRoutes\(app,\{requireSession,requireAdmin\}\)/,'star ledger installer must pass both auth guards to item shop');
assert.match(starLedgerSource,/import \{ installRestoreValidationMiddleware \} from '\.\/restore-validation-middleware\.js';/,'star ledger must import restore validation middleware');
assert.match(starLedgerSource,/installRestoreValidationMiddleware\(app,\{requireAdmin\}\)/,'restore validation middleware must be installed before legacy restore route registration');

const serverSource=fs.readFileSync(new URL('./server.js',import.meta.url),'utf8');
assert.match(serverSource,/installStarLedgerRoutes\(app,\{requireSession,requireAdmin,publishLiveEvent\}\)/,'server must pass both auth guards and the bounded live-event publisher into star ledger routes');

console.log('item shop route contract: ok');
