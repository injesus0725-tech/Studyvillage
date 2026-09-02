const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=__dirname;
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const catalog=read('server/avatar-shop-pack-v3.js'),renderer=read('avatar-renderer.js'),shop=read('student-shop.js'),customize=read('customize.js'),ranking=read('village-layout.js'),server=read('server/server.js'),admin=read('admin.js'),adminShop=read('admin-shop.js'),adminHtml=read('admin.html'),itemShop=read('server/item-shop.js');
const expected=['v2/bases/study-boy-v2.png','v2/bases/study-girl-v2.png','v2/outfits/camp-explorer-v1.png','v2/pets/cream-pup-v1.png'];
for(const rel of expected){const full=path.join(root,'assets/avatar-runtime',rel),data=fs.readFileSync(full);assert.equal(data.toString('ascii',1,4),'PNG',`${rel} must be PNG`);assert.equal(data.readUInt32BE(16),256,`${rel} width must be 256`);assert.equal(data.readUInt32BE(20),256,`${rel} height must be 256`);assert.ok(renderer.includes(rel),`renderer missing ${rel}`)}
for(const id of ['outfit-camp-explorer-v2','effect-starlight-v2','pet-cream-pup-v2']){assert.ok(catalog.includes(`'${id}'`),`active one-set catalog missing ${id}`);assert.ok(renderer.includes(`'${id}'`),`renderer missing ${id}`)}
for(const id of ['outfit-silver-knight','pet-maltese-production','pet-cheese-cat-production'])assert.ok(!catalog.includes(`'${id}'`),`retired tester product returned: ${id}`);
assert.ok(shop.includes("item.slot==='physical'||!renderer")&&shop.includes('shop-preview-${item.slot}'),'student shop must render every digital layer including the new effect');
assert.ok(customize.includes("const slots=['outfit','effect','pet']"),'wardrobe must expose the complete one-set equipment');
assert.ok(ranking.includes("['outfit','effect','bottom','shoes','hat','glasses','bag','hand','pet']"),'ranking must paint outfit, effect, and pet');
assert.ok(server.includes('equipment:rankingEquipment(row)'),'ranking API must return allowlisted equipment');
assert.ok(admin.includes("for(const slot of ['effect','outfit','pet'])"),'teacher student table must paint canonical avatar layers');
assert.ok(adminShop.includes('admin-shop-product-preview'),'teacher shop must render graphical product previews');
assert.ok(adminHtml.includes('avatar-renderer.js?v=20260902art3'),'teacher mode must load the canonical renderer');
for(const token of ["NEW_ART_RESET_KEY='avatar:new-art-reset:v2'","stars=0","equipment_json='{}'","owned_items_json='[]'","DELETE FROM star_ledger"])assert.ok(itemShop.includes(token),`one-time tester reset missing: ${token}`);
console.log('new art one-set integration contract passed');
