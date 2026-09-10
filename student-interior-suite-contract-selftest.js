const assert=require('assert');
const fs=require('fs');
const layout=fs.readFileSync('village-layout.js','utf8');
const expedition=fs.readFileSync('assets/student-exploration-v2.js','utf8');
const html=fs.readFileSync('index.html','utf8');

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
assert.ok(expedition.includes("explore.id='exploration-cave'")&&expedition.includes('cave-rocks')&&expedition.includes('탐험 동굴'),'exploration v2 must own the village cave entrance');
assert.ok(expedition.includes("hub.id='student-explore-panel'"),'exploration v2 must own the expedition catalog and hub');
assert.ok(html.includes('assets/student-exploration-v2.js'),'production must load exploration v2');
assert.ok(!html.includes('assets/student-study-menu.js'),'retired study menu must not load in production');
assert.ok(!layout.includes('innerHTML=`<span class="sv-rank-number">${p.name}'),'student names must not be placed in rank-number markup');
console.log('student village theme, ranking, and exploration v2 ownership contract selftest passed');
