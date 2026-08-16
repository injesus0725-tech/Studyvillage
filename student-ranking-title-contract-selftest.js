const fs=require('fs'),assert=require('assert');
const layout=fs.readFileSync('village-layout.js','utf8'),data=fs.readFileSync('data-service.js','utf8'),server=fs.readFileSync('server/server.js','utf8');
assert.ok(data.includes("title:typeof d.title==='string'?d.title:undefined"),'ranking data must retain the server title');
assert.ok(server.includes("app.get('/api/ranking',requireSession"),'class ranking must remain student-session protected');
assert.ok(layout.includes("currentTitle=String(p.title||'새싹 주민')"),'ranking must use the current verified title with a safe fallback');
assert.ok(layout.includes('class="sv-rank-title"')&&layout.includes('🏷️ ${esc(currentTitle)}'),'ranking must display escaped titles');
assert.ok(layout.includes('.sv-rank-title{')&&layout.includes('text-overflow:ellipsis'),'long valid titles must not break the tablet ranking layout');
assert.ok(layout.includes("players.sort((a,b)=>(Number(b.totalScore)||0)-(Number(a.totalScore)||0)||(Number(b.xp)||0)-(Number(a.xp)||0)"),'titles must not change the established score and XP ranking order');
console.log('student ranking title contract self-test passed');
