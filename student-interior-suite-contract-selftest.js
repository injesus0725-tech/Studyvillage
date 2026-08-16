const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('village-layout.js','utf8');

for(const token of [
  'student-facing interior theme',
  "makeButton('explore','🧭 탐험')",
  "makeButton('ranking','🏆 랭킹')",
  "'student-explore-panel'",
  "'student-ranking-panel'",
  'window.StudyVillageData.listPlayers()',
  "players.slice(0,30)",
  "p.name===me?' me':''",
  '현재 탐험 중',
  '다음 업데이트에서 열려요'
])assert.ok(src.includes(token),`student interior suite is missing ${token}`);

assert.ok(src.includes("String(a.name).localeCompare(String(b.name),'ko')"),'equal ranking scores must have deterministic ordering');
assert.ok(src.includes("if(event.key!=='Escape')return"),'exploration and ranking panels must support internal back navigation');
assert.ok(!src.includes('innerHTML=`<span class="sv-rank-number">${p.name}'),'student names must not be placed in rank-number markup');
console.log('student interior suite contract selftest passed');
