const fs=require('fs'),assert=require('assert');
const shop=fs.readFileSync('student-shop.js','utf8');
const overlay=fs.readFileSync('assets/student-overlay-manager.js','utf8');
assert.ok(shop.includes("panel.id='student-shop-panel'"),'shop must own an independent panel');
assert.ok(shop.includes("shopButton.addEventListener('click',openShop)"),'shop button must open only the shop panel');
assert.ok(!shop.includes("const panel=document.querySelector('#customize-panel')"),'shop must not mount inside the wardrobe');
assert.ok(!shop.includes("#customize-button')?.addEventListener('click'"),'wardrobe button must not load or open the shop');
assert.ok(overlay.includes("button.id==='shop-button')except=document.querySelector('#student-shop-panel')"),'overlay routing must keep shop and wardrobe distinct');
console.log('student shop separation contract self-test passed');
