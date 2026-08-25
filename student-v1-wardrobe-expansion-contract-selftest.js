const fs=require('fs'),assert=require('assert');
const shop=fs.readFileSync('server/item-shop.js','utf8'),customize=fs.readFileSync('customize.js','utf8'),index=fs.readFileSync('index.html','utf8'),renderer=fs.readFileSync('avatar-renderer.js','utf8'),validator=fs.readFileSync('server/backup-validator.js','utf8'),spec=fs.readFileSync('AVATAR_ITEM_SPEC.md','utf8');
const slots=['hair','hat','glasses','outfit','shoes','bag','hand','pet'];
for(const slot of slots){assert.ok(shop.includes(`'${slot}'`),`server shop missing ${slot}`);assert.ok(customize.includes(`'${slot}'`),`wardrobe missing ${slot}`);assert.ok(validator.includes(`'${slot}'`),`backup validator missing ${slot}`);assert.ok(spec.includes(`| ${slot} |`),`spec missing ${slot}`)}
for(const slot of ['hair','outfit','shoes','hand']){assert.ok(index.includes(`id="player-${slot}"`)&&index.includes(`id="preview-${slot}"`),`${slot} layers must exist in village and preview`)}
for(const id of ['hair-short','hair-bob','hair-ponytail','hair-blue','outfit-hoodie','outfit-uniform','outfit-wizard','outfit-armor','shoes-sneakers','shoes-boots','shoes-wing','hand-sword','hand-wand','hand-book','hand-magnifier','pet-dog','pet-rabbit','pet-dragon','pet-slime'])assert.ok(shop.includes(`'${id}'`)&&renderer.includes(`'${id}'`),`expanded item missing from shop or renderer: ${id}`);
const defaultPrices=shop.match(/const DEFAULT_PRICES=Object\.freeze\(\{([^;]+)\}\);/)?.[1]||'';
assert.ok((defaultPrices.match(/':\d+/g)||[]).length>=40,'V1 shop must contain at least 40 priced products');
console.log('student V1 wardrobe expansion contract self-test passed');
