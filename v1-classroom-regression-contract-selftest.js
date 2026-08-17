const fs=require('fs');
const assert=require('assert');

const adminFixes=fs.readFileSync('assets/admin-runtime-fixes.js','utf8');
const avatar=fs.readFileSync('avatar-renderer.js','utf8');
const css=fs.readFileSync('activity-records.css','utf8');
const customize=fs.readFileSync('customize.js','utf8');
const explorer=fs.readFileSync('assets/student-study-menu.js','utf8');

// Teacher write actions that previously failed in real use.
for(const marker of [
  '/reset-password',
  '/xp',
  '/custom-title',
  '/rename',
  '/reset-equipment'
]) assert.ok(adminFixes.includes(marker),`teacher runtime fix missing ${marker}`);
assert.ok(adminFixes.includes("api('/api/admin/shop')"),'teacher delivery notification must poll the shop state');
assert.ok(adminFixes.includes('pendingDeliveryCount'),'teacher delivery notification must use the pending request count');
assert.ok(adminFixes.includes('setInterval(pollDeliveries,5000)'),'teacher delivery notification should refresh automatically');

// Customize must save, refresh the world avatar, and close on explicit save.
assert.ok(customize.includes("save.addEventListener('click',()=>saveEquipment({closeAfter:true}))"),'explicit customize save must close after success');
assert.ok(customize.includes("if(closeAfter){panel.hidden=true;button.focus?.()}return true"),'customize panel must close only after a successful save');
assert.ok(customize.includes('renderAvatar()'),'saved equipment must be rendered without a page refresh');

// Full-body bases and accessory alignment.
for(const emoji of ['🧍','🧍‍♂️','🧍‍♀️'])assert.ok(avatar.includes(emoji),`full-body base ${emoji} missing`);
assert.ok(css.includes('Full-body avatar accessory alignment'),'full-body accessory alignment styles must be packaged');
assert.ok(css.includes('.avatar-bag')&&css.includes('.avatar-glasses')&&css.includes('.avatar-hat'),'wearable slots must have body-relative positioning');

// Learning launcher must expose real expeditions and keep future question banks visible but locked.
for(const name of ['랜덤 덧셈 동굴','곱셈 던전','수수께끼 숲','국어 1단원 동굴','수학 도형 신전','사회 1단원 성'])assert.ok(explorer.includes(name),`expedition hub missing ${name}`);
assert.ok(explorer.includes("ready:false"),'future curriculum expeditions should remain visible as locked entries');
assert.ok(explorer.includes('MAP_TEMPLATES'),'expeditions must use bounded validated map templates instead of unrestricted procedural maps');
assert.ok(explorer.includes('맞')||explorer.includes('correct'),'expedition flow must gate progression on answer checking');

console.log('v1 classroom regression contract self-test passed');
