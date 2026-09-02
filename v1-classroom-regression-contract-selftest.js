const fs=require('fs');
const assert=require('assert');

const adminHtml=fs.readFileSync('admin.html','utf8');
const adminEdits=fs.readFileSync('admin-student-edit.js','utf8');
const delivery=fs.readFileSync('assets/admin-delivery-notifications.js','utf8');
const onboarding=fs.readFileSync('onboarding.js','utf8');
const avatar=fs.readFileSync('avatar-renderer.js','utf8');
const css=fs.readFileSync('avatar-assets.css','utf8');
const customize=fs.readFileSync('customize.js','utf8');
const explorer=fs.readFileSync('assets/student-exploration-v2.js','utf8');
const expeditionGuard=fs.readFileSync('assets/expedition-entry-guard.js','utf8');
const explorationPools=fs.readFileSync('assets/student-exploration-subject-pools.js','utf8');
const curriculum=fs.readFileSync('assets/student-curriculum-learning.js','utf8');
const challenge=fs.readFileSync('assets/student-challenge-hall.js','utf8');
const activityTaxonomy=fs.readFileSync('activity-taxonomy.js','utf8');
const serverActivityMeta=fs.readFileSync('server/activity-metadata.js','utf8');
const mathServer=fs.readFileSync('server/math-practice.js','utf8');

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

// Keep the proven V2 engine internals available while exposing only the four current exploration choices.
for(const name of ['국어의 숲','랜덤 덧셈 동굴','곱셈 던전','사회·과학·예체능 탐험'])assert.ok(explorer.includes(name),`exploration V2 engine missing entry ${name}`);
for(const retired of ['사회의 숲','과학의 숲','랜덤의 숲','수수께끼 숲','도전의 산'])assert.ok(!explorer.includes(`name:'${retired}'`),`retired exploration entry remains: ${retired}`);
assert.ok(explorer.includes("document.querySelector('.sv-quick-button.explore')?.remove()"),'obsolete top-menu exploration entry must stay removed');
assert.ok(explorer.includes("explore=document.querySelector('#exploration-cave')"),'exploration V2 must enter from the village cave');
assert.ok(explorer.includes('PATHS')&&explorer.includes('choosePath()'),'exploration V2 must use bounded path choices instead of unrestricted movement');
assert.ok(explorer.includes('first')&&explorer.includes('mathAnswers'),'exploration V2 must preserve first-choice answer state for scoring');
assert.ok(expeditionGuard.includes("#student-explore-panel button[data-exp]"),'classroom build must guard the active V2 expedition controls');
assert.ok(explorationPools.includes("new Set(['사회','과학','음악','예체능'])"),'exploration integrated pool must keep subjects separate internally');
assert.ok(explorationPools.includes("eligible?.(q,'curriculum')"),'exploration integrated pool must follow the teacher-checked curriculum units');
assert.ok(explorer.includes("{id:'integrated'")&&explorer.includes('사회·과학·예체능 탐험'),'student exploration must expose a direct integrated V2 entry');
assert.ok(explorer.includes("new Set(['사회','과학','음악','예체능'])"),'direct integrated exploration must retain all intended subjects');
assert.ok(explorer.includes("exp.subject==='통합'"),'integrated exploration must use the proven V2 question and reward engine without a synthetic click bridge');
assert.ok(explorer.includes('Math.random()<.1')&&mathServer.includes('Math.random()>=.1'),'catalog and math explorations must keep riddles rare rather than fixed in every five-question run');

// Shared checked unit ranges must drive curriculum and challenge hall; social/science/arts stay integrated for students.
assert.ok(curriculum.includes("subjects:['사회','과학','음악','예체능']"),'curriculum integrated group missing');
assert.ok(curriculum.includes("activityId:'curriculum-integrated'"),'curriculum integrated activity id missing');
assert.ok(challenge.includes("subjects:['국어']")&&challenge.includes("subjects:['수학']"),'challenge hall must reuse Korean and math banks');
assert.ok(challenge.includes("subjects:['사회','과학','음악','예체능']"),'challenge hall integrated group missing');
for(const id of ['curriculum-integrated','curriculum-challenge-korean','curriculum-challenge-math','curriculum-challenge-integrated','exploration-random']){
  assert.ok(activityTaxonomy.includes(`'${id}'`)||activityTaxonomy.includes(`${id}:`),`client activity metadata missing ${id}`);
  assert.ok(serverActivityMeta.includes(`'${id}'`)||serverActivityMeta.includes(`${id}:`),`server activity metadata missing ${id}`);
}
assert.ok(activityTaxonomy.includes("name:'탐험 · 사회·과학·예체능 통합'"),'student records must label integrated exploration correctly');
assert.ok(serverActivityMeta.includes("name:'탐험 · 사회·과학·예체능 통합'"),'server records must label integrated exploration correctly');

console.log('v1 classroom four-exploration regression contract self-test passed');
