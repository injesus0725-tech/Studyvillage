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
const explorationUi=read('assets/student-exploration-v2-subject-ui.js');
const shop=read('student-shop.js');
const customize=read('customize.js');
const mobile=read('onboarding.js');
const overlay=read('assets/student-overlay-manager.js');
const sound=read('sound-effects.js');
const index=read('index.html');

// Login/session: restore may retry once after connectivity/focus recovery, and replaced
// sessions are explicitly cleared instead of leaving an old device stuck in a loading state.
for(const token of ['function retryRestore()','initialAttemptDone','retryUsed','removeRetryListeners()'])assert.ok(sessionRestore.includes(token),`session restore readiness missing ${token}`);
for(const token of ["result?.code==='session-replaced'",'clearSession?.()','location.reload()'])assert.ok(singleSession.includes(token),`single-session recovery missing ${token}`);

// Teacher subject/unit changes must be refreshed before the next student activity, and optional
// supplemental banks must finish registering before the first immutable source snapshot.
for(const token of ['studyvillage:open-library-game','studyvillage:open-curriculum-learning','#exploration-cave','api.refresh()'])assert.ok(liveCatalog.includes(token),`live catalog refresh missing ${token}`);
assert.ok(overrides.includes('await Promise.all([guidePacksReady,supplementReady])'),'supplement and guide packs must register before first catalog snapshot');
assert.ok(overrides.includes("fetchJson('/api/question-catalog/settings')"),'student catalog must fetch fresh teacher settings');

// Every teacher-allowed fresh core completion earns XP; attempt limits remain a separate policy.
for(const id of ['library-vocabulary','math-practice','curriculum-integrated','exploration-korean','exploration-social','exploration-science','exploration-random','riddle-demo'])assert.ok(policy.includes(`'${id}'`)&&policy.includes('REPEAT_XP_ACTIVITIES'),`repeat-XP core activity missing ${id}`);
assert.ok(policy.includes("xpMode:'every-attempt'"),'core reward policy must preserve every-attempt XP');
assert.ok(activityStudent.includes('submissionId')&&activityStudent.includes('deduplicated'),'fresh attempts must reward while duplicate submissions remain idempotent');

// Completed learning flows return directly to the village through their safe close path.
assert.ok(library.includes("next.textContent='마을로 돌아가기 🏡';next.onclick=returnVillage"),'Bookmaru completion must return directly to village');
assert.ok(studentSession.includes("next.textContent='마을로 돌아가기 🏡'"),'challenge completion must expose direct village return');
assert.ok(studentSession.includes("document.querySelector('#quiz-panel #quiz-close')?.click()"),'challenge completion must reuse safe close path');

// Exploration has one V2 entry model: standalone riddle cards/filters stay retired, while riddles
// may still be mixed into common subject/random pools.
assert.doesNotMatch(exploration,/name:'수수께끼 숲'|name:'도전의 산'|data-subject="수수께끼"/,'standalone riddle exploration must remain retired');
assert.ok(exploration.includes("riddles=eligible.filter(q=>q.subject==='창의적 사고')"),'riddles must remain available inside the shared exploration pool');
assert.ok(explorationUi.includes("filters.querySelector('[data-subject=\"수수께끼\"]')?.remove()"),'standalone riddle filter must stay removed');

// Shop and wardrobe remain separate. Wardrobe saves every purchased slot including null and
// retries the complete two-layer persistence pair at most once.
assert.ok(shop.includes("panel.id='student-shop-panel'")&&!shop.includes("const panel=document.querySelector('#customize-panel')"),'shop must stay independent from wardrobe');
assert.ok(customize.includes('purchased=Object.fromEntries(slots.map(slot=>[slot,null]))'),'wardrobe unequip must persist explicit null shop slots');
assert.ok(customize.includes('for(let attempt=0;attempt<2;attempt++)'),'wardrobe two-layer persistence may retry only once');
assert.ok(customize.includes("'/api/player/me/equipment'")&&customize.includes("'/api/shop/equipment'"),'wardrobe must persist both equipment layers');

// iPad/mobile input remains tap-first with foreground overlay isolation and no duplicate touchend path.
assert.ok(!index.includes('data-key="ArrowUp"')&&!index.includes('data-key="ArrowDown"')&&!index.includes('data-key="ArrowLeft"')&&!index.includes('data-key="ArrowRight"'),'legacy direction pad must stay removed');
assert.ok(mobile.includes("if(!world.contains(e.target))return")&&mobile.includes('visibleBlockingPanel()'),'tap movement must be world-scoped and blocked by foreground panels');
assert.ok(!mobile.includes("document.addEventListener('touchend'"),'pointer/touch handlers must not double-fire');
for(const token of ['.sv-mission-panel:not([hidden])','.sv-collection-panel:not([hidden])',"button.id==='mission'","button.id==='collection'"])assert.ok(overlay.includes(token),`overlay isolation missing ${token}`);

// One shared, locally generated sound manager covers global buttons and explicit activity feedback.
assert.ok(index.includes('sound-effects.js?v='),'student build must package/load shared sound manager');
assert.ok(sound.includes("document.addEventListener('click'")&&sound.includes("play(button.closest('.building-interior,.sv2-hub')?'enter':'tap')"),'shared sound manager must cover major menu/shop buttons');
for(const kind of ['correct:','wrong:','reward:','danger:','angel:','villain:','mystery:','complete:','levelup:'])assert.ok(sound.includes(kind),`shared sound pattern missing ${kind}`);

console.log('V1 release readiness contract self-test passed');
