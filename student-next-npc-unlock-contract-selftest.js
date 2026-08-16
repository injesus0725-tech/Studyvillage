const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),riddle=fs.readFileSync('server/riddle-attempt-student.js','utf8'),data=fs.readFileSync('data-service.js','utf8'),game=fs.readFileSync('game.js','utf8'),npcs=fs.readFileSync('random-npcs.js','utf8');
const unlocks=[[10,'wizard','🧙','별빛 마법사'],[20,'dragon','🐲','꼬마 용'],[30,'owl','🦉','지혜 부엉이']];
for(const src of [server,riddle]){for(const [level,id,icon,name] of unlocks)assert.ok(src.includes(`level:${level},id:'${id}',icon:'${icon}',name:'${name}'`),`server preview must include Lv.${level} ${name}`);assert.ok(src.includes('nextNpcUnlock:nextNpcUnlockFor(progress.level)'),'player responses must derive NPC previews from verified level')}
for(const [level,id] of unlocks)assert.ok(npcs.includes(`id:'${id}',requiredLevel:${level}`),`preview and actual ${id} unlock must match`);
assert.ok(data.includes("nextNpcUnlock:d.nextNpcUnlock&&typeof d.nextNpcUnlock==='object'?d.nextNpcUnlock:null"),'client cleaning must retain the server preview');
assert.ok(game.includes("recordNextNpc.id='record-next-npc-unlock'")&&game.includes("recordNextNpc.hidden=!npc"),'record UI must show only a remaining NPC unlock');
assert.ok(game.includes("'🗺️ 다음 마을 친구 · Lv.'+npc.level+' '+npc.icon+' '+npc.name"),'record UI must identify the exact level and NPC');
console.log('student next NPC unlock contract self-test passed');
