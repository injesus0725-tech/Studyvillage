import assert from 'node:assert/strict';
import fs from 'node:fs';
import { installItemShopRoutes } from './item-shop.js';

function fakeApp(){
  const routes=[];
  const app={};
  for(const method of ['get','post','put']){
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
  'PUT /api/admin/shop'
]) assert.ok(installed.has(expected),`missing route: ${expected}`);

assert.equal(routes.find(route=>route.path==='/api/shop')?.handlers[0],requireSession,'student shop route must use student session auth');
assert.equal(routes.find(route=>route.path==='/api/admin/shop')?.handlers[0],requireAdmin,'teacher shop route must use admin auth');

const starLedgerSource=fs.readFileSync(new URL('./star-ledger.js',import.meta.url),'utf8');
assert.match(starLedgerSource,/installStarLedgerRoutes\(app,\{requireSession,requireAdmin\}\)/,'star ledger installer must accept both auth guards');
assert.match(starLedgerSource,/installItemShopRoutes\(app,\{requireSession,requireAdmin\}\)/,'star ledger installer must pass both auth guards to item shop');

console.log('item shop route contract: ok');
