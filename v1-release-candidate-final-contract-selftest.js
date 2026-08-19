const fs=require('fs'),assert=require('assert');
const index=fs.readFileSync('index.html','utf8');
const admin=fs.readFileSync('assets/admin-dashboard-nav.js','utf8');
const checklist=fs.readFileSync('STABILIZATION_DEVICE_CHECKLIST.md','utf8');
const selector=fs.readFileSync('assets/challenge-hall-selector.js','utf8');
const bridge=fs.readFileSync('assets/challenge-hall-attempt-save-bridge.js','utf8');
const camera=fs.readFileSync('assets/expedition-expanded-camera.js','utf8');
const npc=fs.readFileSync('assets/expedition-npc-variety.js','utf8');
const discovery=fs.readFileSync('assets/expedition-discovery-walk.js','utf8');
const avatar=fs.readFileSync('assets/avatar-accessory-standard.js','utf8');

for(const script of [
  'assets/challenge-hall-selector.js',
  'assets/challenge-hall-attempt-save-bridge.js',
  'assets/expedition-expanded-camera.js',
  'assets/expedition-discovery-walk.js',
  'assets/student-expedition-attempt-status.js'
]) assert.ok(index.includes(script),`student release candidate must load ${script}`);

for(const id of ['students','activities','questions','shop','explore','system']) assert.ok(admin.includes(`id:'${id}'`),`teacher dashboard group ${id} missing`);
assert.ok(admin.includes('data-admin-home'),'teacher dashboard must always provide a home return');

assert.ok(selector.includes("easy:{label:'쉬움',count:5}")&&selector.includes("normal:{label:'보통',count:7}")&&selector.includes("hard:{label:'어려움',count:10}"),'challenge difficulty selection incomplete');
assert.ok(selector.includes('activity-attempt-status/riddle-demo'),'challenge hall must expose remaining teacher-controlled attempts');
assert.ok(bridge.includes("fetch('/api/player/me/activity'"),'challenge hall completion must use server-enforced activity saving');

assert.ok(camera.includes('sv-expanded-map'),'expedition expanded map missing');
assert.ok(npc.includes('2+Math.floor(Math.random()*2)'),'expedition must keep 2-3 NPC variety');
assert.ok(discovery.includes('opacity:0')&&discovery.includes('randomPoint(host)'),'expedition hidden discovery must remain proximity-based and randomized');
assert.ok(avatar.includes('anchor')&&avatar.includes('slot')&&avatar.includes('layer'),'avatar equipment standard must retain anchor/slot/layer rules');

assert.ok(checklist.includes('QR → 네이버/Whale 계열'),'manual gate must prioritize the actual classroom browser path');
assert.ok(checklist.includes('Chrome은 이번 교실 V1 후보판의 **병합 차단 조건이 아닙니다.**'),'Chrome must remain non-blocking for this classroom release');
assert.ok(checklist.includes('관리자 홈 전체 연결'),'manual gate must explicitly retest the redesigned teacher dashboard');
assert.ok(checklist.includes('남은 횟수가 정확히 1회 감소'),'manual gate must verify challenge attempt decrement end-to-end');
assert.ok(checklist.includes('모자/안경/가방/펫'),'manual gate must include accessory alignment verification');

console.log('v1 release candidate final cross-layer contract: ok');
