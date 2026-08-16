const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),riddle=fs.readFileSync('server/riddle-attempt-student.js','utf8'),ledger=fs.readFileSync('server/star-ledger.js','utf8');
for(const src of [server,riddle]){
  assert.ok(src.includes("const NPC_LEVEL_UNLOCKS=Object.freeze([{level:10,id:'wizard',icon:'🧙',name:'별빛 마법사'},{level:20,id:'dragon',icon:'🐲',name:'꼬마 용'},{level:30,id:'owl',icon:'🦉',name:'지혜 부엉이'}])"),'both XP save paths must use the same verified NPC level thresholds');
  assert.ok(src.includes('oldLevel<npc.level&&newLevel>=npc.level'),'an NPC may announce only when server XP crosses its unlock level');
  assert.ok(src.includes("'npc-unlock'"),'NPC unlocks need a distinct activity and live-event type');
  assert.ok(src.includes('새 마을 친구 “${npc.name}”을 만날 수 있게 되었습니다!'),'the announcement must identify the verified unlocked NPC');
}
assert.ok(server.includes('function announceNpcUnlock(before,after)'),'the main XP route must centralize NPC unlock announcements');
const record=server.slice(server.indexOf("app.post('/api/player/me/record'"),server.indexOf("app.post('/api/player/me/activity'"));
const activity=server.slice(server.indexOf("app.post('/api/player/me/activity'"),server.indexOf("app.post('/api/player/me/equipment'"));
assert.ok(record.includes('announceNpcUnlock(e,updated)')&&activity.includes('announceNpcUnlock(player,updated)'),'every main XP save path must check verified unlock transitions');
assert.ok(ledger.includes('installRiddleAttemptStudentRoutes(app,{requireSession,publishLiveEvent,commitRiddleReward})'),'the intercepted riddle route must receive the bounded classroom publisher');
assert.ok(riddle.includes('const result=tx(),{liveLevelUp,liveNpcUnlocks,...response}=result'),'riddle announcements must occur only after the durable transaction succeeds');
assert.ok(riddle.includes('try{if(liveLevelUp)publishLiveEvent?.(')&&riddle.includes(')}catch{}'),'announcement failure must not turn saved progress into a failed response');
assert.ok(!riddle.includes('liveNpcUnlocks,...response});'),'internal announcement metadata must not be returned to the student');
console.log('student NPC unlock live event contract self-test passed');
