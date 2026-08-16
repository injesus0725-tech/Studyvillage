const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),riddle=fs.readFileSync('server/riddle-attempt-student.js','utf8'),game=fs.readFileSync('game.js','utf8');
for(const src of [server,riddle]){assert.ok(src.includes("level<2?{level:2,title:'배움 여행자',badge:null}"),'Lv.2 title preview must match real rewards');assert.ok(src.includes("level<3?{level:3,title:'성장하는 도전자',badge:{icon:'⭐',name:'성장하는 학습자'}}"),'Lv.3 preview must match real title and badge');assert.ok(src.includes("level<5?{level:5,title:'학습 탐험가',badge:{icon:'🎓',name:'학습 탐험가'}}:null"),'Lv.5 must be the final currently defined growth preview');assert.ok(src.includes('nextGrowthReward:nextGrowthRewardFor(progress.level)'),'student responses must derive previews from server level state')}
assert.ok(game.includes("recordNextReward.id='record-next-growth-reward'"),'record UI needs a dedicated reward preview');
assert.ok(game.includes('recordNextReward.hidden=!reward'),'undefined future rewards must not show a fake promise');
assert.ok(game.includes('🎁 다음 성장 보상 · Lv.${reward.level} “${reward.title}”'),'preview must show the verified level and title');
console.log('student next growth reward contract self-test passed');
