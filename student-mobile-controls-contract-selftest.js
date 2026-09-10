const assert=require('assert');
const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const onboarding=fs.readFileSync('onboarding.js','utf8');

assert.ok(!html.includes('data-key="ArrowUp"')&&!html.includes('data-key="ArrowDown"')&&!html.includes('data-key="ArrowLeft"')&&!html.includes('data-key="ArrowRight"'),'tablet student UI must not expose the legacy direction pad');
assert.ok(html.includes('id="talk-button"'),'the direct interaction button must remain available');
assert.ok(onboarding.includes("if(!world.contains(e.target))return"),'tap movement must be scoped to the world instead of globally intercepting the page');
assert.ok(onboarding.includes("e.target.closest?.('.building,.npc,#player,button,a,input,select,textarea,[role=\"button\"],[role=\"dialog\"]')"),'native controls and world interaction targets must be excluded from tap movement routing');
assert.ok(!onboarding.includes('function routeTouch('),'legacy global touch hit routing must stay removed');
assert.ok(!onboarding.includes("document.addEventListener('touchend'"),'pointer and touch fallback handlers must not double-fire student controls');
assert.ok(onboarding.includes('visibleBlockingPanel()'),'tap movement must stop while a foreground activity or modal is open');
console.log('student touch movement and native control contract selftest passed');
