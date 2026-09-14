const fs=require('fs'),assert=require('assert');
const admin=fs.readFileSync('admin-shop.js','utf8'),server=fs.readFileSync('server/item-shop.js','utf8'),live=fs.readFileSync('live-events.js','utf8'),student=fs.readFileSync('student-shop.js','utf8');
assert.ok(admin.includes("event.target.matches('[data-shop-available]')&&event.target.checked)toggle.checked=true"),'enabling one item must also enable the student shop');
assert.ok(admin.includes("if(value&&!toggle.checked){toggle.checked=true;changed=true}"),'bulk sell must also enable the student shop');
assert.ok(server.includes("'shop-config-updated'"),'admin shop save must publish a live refresh event');
assert.ok(live.includes("e.type==='shop-config-updated'")&&live.includes("new Event('studyvillage:shop-refresh')"),'students must translate shop configuration events into a shop refresh');
assert.ok(student.includes("window.addEventListener('studyvillage:shop-refresh',load)"),'open student runtime must listen for shop refresh');
assert.ok(student.includes("window.addEventListener('focus',()=>{if(!panel.hidden)load()})"),'returning to an open shop must reload authoritative settings');
console.log('shop live availability contract self-test passed');
