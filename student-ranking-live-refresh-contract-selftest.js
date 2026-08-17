const fs=require('fs'),assert=require('assert');
const layout=fs.readFileSync('village-layout.js','utf8'),game=fs.readFileSync('game.js','utf8'),customize=fs.readFileSync('customize.js','utf8');
assert.ok(layout.includes('async function refreshRanking(){if(ranking.hidden)return;'),'closed rankings must not make background requests');
assert.ok(layout.includes('const requestId=++rankingRequestId')&&layout.includes('if(requestId!==rankingRequestId||ranking.hidden)return'),'a slow older ranking response must not overwrite a newer view');
assert.ok(layout.includes("window.addEventListener('studyvillage:ranking-refresh',refreshRanking)")&&layout.includes("window.addEventListener('studyvillage:activity-record-refresh',refreshRanking)"),'open rankings must follow profile and activity changes');
assert.ok(customize.includes("message.textContent='캐릭터 모습이 저장됐어요! ✨';window.dispatchEvent(new Event('studyvillage:ranking-refresh'))"),'saved character equipment must refresh ranking avatars');
assert.ok(game.indexOf("window.dispatchEvent(new Event('studyvillage:ranking-refresh'))",game.indexOf('async function changeCustomTitle'))>game.indexOf('applyRecord(data.player)'),'a verified title change must refresh ranking titles');
assert.ok(game.indexOf("window.dispatchEvent(new Event('studyvillage:ranking-refresh'))",game.indexOf('async function renderQuizResult'))>game.indexOf('applyRecord(confirmed)'),'a verified riddle result must refresh level order');
console.log('student ranking live refresh contract self-test passed');
