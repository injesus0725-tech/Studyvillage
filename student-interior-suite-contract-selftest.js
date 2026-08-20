const assert=require('assert');
const fs=require('fs');
const layout=fs.readFileSync('village-layout.js','utf8');
const expedition=fs.readFileSync('assets/student-study-menu.js','utf8');

for(const token of [
  'student-facing interior theme',
  "makeButton('ranking','🏆 랭킹')",
  "ranking.id='student-ranking-panel'",
  'window.StudyVillageData.listPlayers()',
  'players.slice(0,30)',
  "p.name===me?' me':''"
])assert.ok(layout.includes(token),`student village/ranking suite is missing ${token}`);

assert.ok(layout.includes("String(a.name).localeCompare(String(b.name),'ko')"),'equal ranking scores must have deterministic ordering');
assert.ok(layout.includes("if(event.key!=='Escape'||ranking.hidden)return"),'ranking panel must consume its own back navigation');
assert.ok(!layout.includes('activity-attempt-status/'),'village layout must not perform expedition attempt checks');
assert.ok(!layout.includes('sv-expedition-panel'),'legacy expedition panel must be retired from village layout');
assert.ok(!layout.includes("makeButton('explore'"),'village layout must not create a second exploration entry button');
assert.ok(expedition.includes('const EXPEDITIONS=['),'student study menu must be the single owner of expedition catalog and entry UI');
assert.ok(expedition.includes("exploreButton.textContent='🧭 탐험'"),'student study menu must own the exploration button when no legacy button exists');
assert.ok(!layout.includes('innerHTML=`<span class="sv-rank-number">${p.name}'),'student names must not be placed in rank-number markup');
console.log('student village theme, ranking, and unified expedition ownership contract selftest passed');
