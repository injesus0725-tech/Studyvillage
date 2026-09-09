const fs=require('fs'),assert=require('assert');
const nav=fs.readFileSync('assets/admin-quick-navigation.js','utf8');
const delivery=fs.readFileSync('assets/admin-delivery-notifications.js','utf8');
const html=fs.readFileSync('admin.html','utf8');
assert.ok(nav.includes('.admin-sticky-controls{position:sticky;top:0'),'main admin controls must remain visible while scrolling');
assert.ok(nav.includes('sticky.appendChild(actions)')&&nav.includes('sticky.appendChild(nav)'),'actions and quick navigation must share one sticky stack');
assert.ok(delivery.includes("document.querySelector('#refresh-button')?.click()"),'new delivery requests must refresh visible admin data');
assert.ok(html.includes('admin-delivery-notifications.js?v=20260909sticky1')&&html.includes('admin-quick-navigation.js?v=20260909sticky1'),'admin sticky controls must use fresh cache keys');
console.log('admin sticky controls contract self-test passed');
