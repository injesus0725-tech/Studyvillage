const fs=require('fs'),assert=require('assert');
const read=file=>fs.readFileSync(file,'utf8');

const sessionRestore=read('session-restore.js');
const singleSession=read('student-single-session.js');
const liveCatalog=read('assets/student-question-catalog-live-refresh.js');
const overrides=read('assets/student-question-overrides.js');
const policy=read('server/activity-attempt-settings.js');
const activityStudent=read('server/activity-attempt-student.js');
const library=read('library-game.js');
const studentSession=read('student-session.js');
const exploration=read('assets/student-exploration-v2.js');
const shop=read('student-shop.js');
const customize=read('customize.js');
const mobile=read('onboarding.js');
const overlay=read('assets/student-overlay-manager.js');
const sound=read('sound-effects.js');
const index=read('index.html');
const game=read('game.js'),pkg=JSON.parse(read('package.json'));

for(const token of ['function retryRestore()','initialAttemptDone','retryUsed','removeRetryListeners()'])assert.ok(sessionRestore.includes(token),`session restore readiness missing ${token}`);
for(const token of ["result?.code==='session-replaced'",'clearSession?.()','location.reload()'])assert.ok(singleSession.includes(token),`single-session recovery missing ${token}`);
for(const token of ['studyvillage:open-library-game','studyvillage:open-curriculum-learning','#exploration-cave','api.refresh()'])assert.ok(liveCatalog.includes(token),`live catalog refresh missing ${token}`);
assert.ok(overrides.includes('await Promise.all([guidePacksReady,supplementReady])'),'supplement and guide packs must register before first catalog snapshot');
assert.ok(overrides.includes("fetchJson('/api/question-catalog/settings')"),'student catalog must fetch fresh teacher settings');
for(const id of ['library-vocabulary','math-arithmetic','curriculum-integrated','exploration-korean','exploration-social','exploration-science','exploration-random','riddle-demo'])assert.ok(policy.includes(`'${id}'`)&&policy.includes('REPEAT_XP_ACTIVITIES'),`repeat-XP core activity missing ${id}`);
assert.ok(policy.includes("xpMode:'every-attempt'"),'core reward policy must preserve every-attempt XP');
assert.ok(activityStudent.includes('submissionId')&&activityStudent.includes('deduplicated'),'fresh attempts must reward while duplicate submissions remain idempotent');
assert.ok(library.includes("next.textContent='마을로 돌아가기 🏡';next.onclick=returnVillage"),'Bookmaru completion must return directly to village');
assert.ok(studentSession.includes("next.textContent='마을로 돌아가기 🏡'"),'challenge completion must expose direct village return');
assert.ok(studentSession.includes("document.querySelector('#quiz-panel #quiz-close')?.click()"),'challenge completion must reuse safe close path');
assert.doesNotMatch(exploration,/name:'수수께끼 숲'|name:'도전의 산'|data-subject="수수께끼"/,'standalone riddle exploration must remain retired');
assert.ok(exploration.includes("riddles=eligible.filter(q=>q.subject==='창의적 사고')"),'riddles must remain available inside the shared exploration pool');
assert.ok(exploration.includes('사회·과학·예체능 탐험')&&exploration.includes("exp.subject==='통합'"),'integrated exploration must be a direct V2 engine entry');

// The legacy endpoint first replaces the whole equipment JSON, clearing removed purchased slots.
// The shop endpoint then restores only currently selected purchased slots. Sending null for every
// non-purchased slot would erase valid built-in selections that the first endpoint just saved.
assert.ok(shop.includes("panel.id='student-shop-panel'")&&!shop.includes("const panel=document.querySelector('#customize-panel')"),'shop must stay independent from wardrobe');
assert.ok(customize.includes('purchased={}')&&customize.includes('purchased[slot]=id'),'wardrobe must send a sparse purchased-item restore map after the full legacy replacement');
assert.ok(!customize.includes('purchased=Object.fromEntries(slots.map(slot=>[slot,null]))'),'shop restore must not clear built-in wardrobe slots with blanket null values');
assert.ok(customize.includes('for(let attempt=0;attempt<2;attempt++)'),'wardrobe two-layer persistence may retry only once');
assert.ok(customize.includes("'/api/player/me/equipment'")&&customize.includes("'/api/shop/equipment'"),'wardrobe must persist both equipment layers');

assert.ok(!index.includes('data-key="ArrowUp"')&&!index.includes('data-key="ArrowDown"')&&!index.includes('data-key="ArrowLeft"')&&!index.includes('data-key="ArrowRight"'),'legacy direction pad must stay removed');
assert.ok(mobile.includes("if(!world.contains(e.target))return")&&mobile.includes('visibleBlockingPanel()'),'tap movement must be world-scoped and blocked by foreground panels');
assert.ok(!mobile.includes("document.addEventListener('touchend'"),'pointer/touch handlers must not double-fire');
for(const token of ["'.sv-mission-panel'","'.sv-collection-panel'","button.classList?.contains('mission')","button.classList?.contains('collection')"])assert.ok(overlay.includes(token),`overlay isolation missing ${token}`);
assert.ok(index.includes('sound-effects.js?v='),'student build must package/load shared sound manager');
assert.ok(sound.includes("document.addEventListener('click'")&&sound.includes("play(button.closest('.building-interior,.sv2-hub')?'enter':'tap')"),'shared sound manager must cover major menu/shop buttons');
for(const kind of ['correct:','wrong:','reward:','danger:','angel:','villain:','mystery:','complete:','levelup:'])assert.ok(sound.includes(kind),`shared sound pattern missing ${kind}`);
assert.ok(game.includes(`StudyVillage v${pkg.version}`),'student title version must match the packaged release version');

console.log('V1 release readiness contract self-test passed');
