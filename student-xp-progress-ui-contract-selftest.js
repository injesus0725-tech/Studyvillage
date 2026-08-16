const fs=require('fs'),assert=require('assert');
const game=fs.readFileSync('game.js','utf8'),style=fs.readFileSync('style.css','utf8');
for(const text of ["recordXpTrack.id='record-xp-track'","setAttribute('role','progressbar')","setAttribute('aria-label','다음 레벨 경험치 진행률')","recordXpProgress.after(recordXpTrack)"])assert.ok(game.includes(text),`XP progress UI missing: ${text}`);
assert.ok(game.includes('Math.round(state.xpIntoLevel/state.xpToNext*100)'),'progress width must use the current variable level span');
assert.ok(game.includes('recordXpProgress.textContent=`Lv.${state.level+1}까지 ${remaining} XP · ${percent}%`'),'students must see the next level, remaining XP, and percent');
for(const attribute of ['aria-valuemin','aria-valuemax','aria-valuenow'])assert.ok(game.includes(`setAttribute('${attribute}'`),`accessible progress missing ${attribute}`);
assert.ok(style.includes('#record-xp-track')&&style.includes('#record-xp-track>span'),'XP progress track and fill must be styled');
console.log('student XP progress UI contract self-test passed');
