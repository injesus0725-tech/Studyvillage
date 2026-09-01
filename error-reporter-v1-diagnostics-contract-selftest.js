const fs=require('fs');
const assert=require('assert');
const pkg=require('./package.json');
const src=fs.readFileSync('error-reporter.js','utf8');

assert.ok(src.includes(`VERSION='${pkg.version}'`),'error reporter version must match package version');
assert.ok(src.includes("window.addEventListener('studyvillage:shop-purchase'"),'shop purchases must leave a diagnostic breadcrumb');
assert.ok(src.includes("window.addEventListener('studyvillage:equip-purchased-item'"),'equipment requests must leave a diagnostic breadcrumb');
assert.ok(src.includes("window.addEventListener('studyvillage:stars-refresh'"),'star refreshes must leave a diagnostic breadcrumb');
assert.ok(src.includes("bookmaru score=${Number(e.detail?.score)||0} stars=${Number(e.detail?.stars)||0} xp=${Number(e.detail?.gainedXp)||0}"),'Bookmaru completion diagnostics must retain score/star/xp context');
assert.ok(src.includes("const CRITICAL_MUTATIONS=['/api/player/me/activity','/api/player/me/equipment','/api/shop/purchase','/api/player/me/checkpoints/']"),'critical V1 mutation endpoints must be explicitly tracked');
assert.ok(src.includes("else if(response.ok&&critical)addEvent('api-success'"),'successful critical mutations must remain in the recent event trail');
assert.ok(src.includes("saveReport('api-network-error'"),'network failures during critical mutations must create a report');
assert.ok(src.includes("else if(critical&&[408,429].includes(response.status))saveReport('api-critical-failure'"),'timeouts/rate limits on critical mutations must create a report');
assert.ok(!src.includes('req.body'),'client diagnostics must not collect request bodies');
console.log('V1 error diagnostics contract self-test passed');
