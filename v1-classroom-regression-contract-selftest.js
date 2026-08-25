const fs=require('fs');
const assert=require('assert');

const adminHtml=fs.readFileSync('admin.html','utf8');
const adminEdits=fs.readFileSync('admin-student-edit.js','utf8');
const delivery=fs.readFileSync('assets/admin-delivery-notifications.js','utf8');
const onboarding=fs.readFileSync('onboarding.js','utf8');
const avatar=fs.readFileSync('avatar-renderer.js','utf8');
const css=fs.readFileSync('avatar-assets.css','utf8');
const customize=fs.readFileSync('customize.js','utf8');
const explorer=fs.readFileSync('assets/student-study-menu.js','utf8');

// Teacher write actions must use one canonical handler; duplicate capture interception caused real classroom failures.
for(const marker of ['/xp','/custom-title','/rename','/reset-equipment'])assert.ok(adminEdits.includes(marker),`canonical teacher edit missing ${marker}`);
assert.ok(!adminHtml.includes('assets/admin-runtime-fixes.js'),'duplicate teacher write interceptor must not load');
assert.ok(adminHtml.includes('/?teacher-preview=1'),'teacher student preview must carry a safe return marker');
assert.ok(delivery.includes('/api/admin/shop'),'teacher delivery notification must poll shop state');

// Student login must enter the village immediately: no automatic first-login modal may capture all touches.
assert.ok(!onboarding.includes('studyvillage:first-character-choice'),'first-login character modal must not block student entry');
assert.ok(!onboarding.includes('MutationObserver(showGuideOnce)'),'guide must not auto-open after login');
assert.ok(onboarding.includes("get('teacher-preview')==='1'"),'teacher preview must expose a return path');
assert.ok(onboarding.includes("back.href='/admin.html'"),'teacher preview return must lead back to admin');

// Customize must save, refresh the world avatar, and close on explicit save.
assert.ok(customize.includes("save.addEventListener('click',()=>saveEquipment({closeAfter:true}))"),'explicit customize save must close after success');
assert.ok(customize.includes("if(closeAfter){panel.hidden=true;button.focus?.()}return true"),'customize panel must close only after a successful save');
assert.ok(customize.includes('renderAvatar()'),'saved equipment must be rendered without a page refresh');

for(const base of ['student-default','student-boy','student-girl'])assert.ok(avatar.includes(`'${base}'`),`modular mini-me base ${base} missing`);
assert.ok(avatar.includes('viewBox="0 0 96 144"'),'all avatar parts must use the fixed anatomical canvas');
assert.ok(css.includes('One fixed full-body canvas'),'fixed full-body accessory alignment styles must be packaged');
assert.ok(css.includes('.avatar-bag')&&css.includes('.avatar-glasses')&&css.includes('.avatar-hat'),'wearable slots must have body-relative positioning');

for(const name of ['랜덤 덧셈 동굴','곱셈 던전','수수께끼 숲','국어 1단원 동굴','수학 도형 신전','사회 1단원 성'])assert.ok(explorer.includes(name),`expedition hub missing ${name}`);
assert.ok(explorer.includes("ready:false"),'future curriculum expeditions should remain visible as locked entries');
assert.ok(explorer.includes('MAP_TEMPLATES'),'expeditions must use bounded validated map templates instead of unrestricted procedural maps');
assert.ok(explorer.includes('맞')||explorer.includes('correct'),'expedition flow must gate progression on answer checking');

console.log('v1 classroom regression contract self-test passed');
