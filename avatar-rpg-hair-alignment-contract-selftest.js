const assert=require('assert');
const fs=require('fs');
const path=require('path');

const root=__dirname;
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/avatar-rpg/manifest.json'),'utf8'));
const files=[...Object.values(manifest.internalBases||{}),...Object.values(manifest.defaultHair||{}),manifest.alignmentProof?.boyHairPreview,manifest.alignmentProof?.girlHairPreview,manifest.alignmentProof?.boyHairSwapPreview,manifest.alignmentProof?.girlHairSwapPreview].filter(Boolean);
assert.strictEqual(manifest.rules?.hairIsIndependentLayer,true,'hair must be an independent layer');
assert.strictEqual(manifest.rules?.defaultHairAlwaysAutoEquipped,true,'a default hair layer must be auto-equipped');
assert.strictEqual(manifest.rules?.hairlessBaseNeverShownAlone,true,'internal hairless bases must never be user-visible alone');
assert.strictEqual(new Set(files).size,files.length,'every modular proof asset should have a distinct file');
for(const file of files){const full=path.join(root,'assets/avatar-rpg',file);assert.ok(fs.existsSync(full),`${file} must exist`);assert.ok(fs.statSync(full).size>10_000,`${file} must be a real production raster asset`)}

const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/avatar-alignment-overhaul-v1.css'),'utf8');
const visual=fs.readFileSync(path.join(root,'assets/avatar-visual-overhaul-v1.js'),'utf8');
const premium=fs.readFileSync(path.join(root,'assets/avatar-special-outfit-overhaul-v2.js'),'utf8');
const shop=fs.readFileSync(path.join(root,'server/avatar-shop-pack-v3.js'),'utf8');
assert.ok(html.includes('assets/avatar-alignment-overhaul-v1.css?v=20260830c'),'student build must load the latest wardrobe/ranking alignment pass');
assert.ok(html.includes('assets/avatar-special-outfit-overhaul-v2.js?v=20260830a'),'student build must load the premium full-body outfit replacement pass');
assert.ok(html.includes('assets/avatar-visual-overhaul-v1.js?v=20260830a'),'student build must load the special-character overhaul');
for(const prefix of ['hair-','bottom-','shoes-'])assert.ok(css.includes(`[data-avatar-item^="${prefix}"]`),`global ${prefix} alignment selector missing`);
for(const id of ['hair-bob','hair-ponytail','hair-mohawk','hair-braid','hair-spiky-brown','hair-shoulder-wave','hair-flame-red','hair-lavender-bob'])assert.ok(css.includes(id),`hair exception alignment missing ${id}`);
for(const id of ['bottom-shorts','bottom-skirt','bottom-jogger-gray','bottom-leggings-black','bottom-adventure-brown'])assert.ok(css.includes(id),`bottom exception alignment missing ${id}`);
for(const id of ['shoes-boots','shoes-wing','shoes-sneakers-green','shoes-runners-purple','shoes-trail-orange'])assert.ok(css.includes(id),`shoe exception alignment missing ${id}`);
assert.ok(css.includes('display:block!important'),'equipped hair must no longer stay hidden by the temporary RPG layer');
assert.ok(css.includes('.sv-rank-avatar>span{position:absolute!important'),'ranking layers must share the full-body canvas');
for(const id of ['outfit-uniform','outfit-wizard','outfit-armor']){assert.ok(premium.includes(`r.ASSETS['${id}']`),`${id} must be replaced by a dedicated full-body asset`);assert.ok(css.includes(`[data-avatar-item="${id}"]`),`${id} must participate in full-body suppression rules`)}
assert.ok(css.includes('.sv-rank-avatar:has(.sv-rank-outfit'),'ranking must suppress separate bottoms/shoes for premium full-body outfits');
for(const theme of ['scout','scholar','runner','mage','knight','ranger','bard','hero','guardian'])assert.ok(visual.includes(theme),`special character theme missing ${theme}`);
for(const name of ['밤빛 모험가','책마루 학자','초록 정찰대','별빛 마법사','햇살 기사','숲의 레인저','보랏빛 음유시인','붉은 용사','은빛 수호자'])assert.ok(shop.includes(name),`special-character shop name missing ${name}`);
assert.ok(visual.includes("for(const gender of ['boy','girl'])"),'both boy and girl special characters must be generated from the nine distinct themes');
console.log('avatar RPG hair, full wardrobe/ranking alignment, premium full-body outfits, and special-character differentiation contract passed');
