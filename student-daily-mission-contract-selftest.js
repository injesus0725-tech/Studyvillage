const assert=require('assert');
const fs=require('fs');
const client=fs.readFileSync('daily-missions.js','utf8');
const server=fs.readFileSync('server/star-ledger.js','utf8');
const html=fs.readFileSync('index.html','utf8');

for(const id of ['exploration-forest-riddle','exploration-mountain-riddle','vocabulary'])assert(server.includes(`activityId:'${id}'`),`missing mission activity ${id}`);
for(const giver of ['숲길 여우','꼬마 용','책방 유령'])assert(server.includes(`giver:'${giver}'`),`missing mission giver ${giver}`);
assert.match(server,/seed%DAILY_MISSIONS\.length/,'daily assignment must be stable per student and date');
assert.match(server,/timeZone:'Asia\/Seoul'/,'mission day must follow the classroom timezone');
assert.match(server,/FROM activity_records WHERE player_name=\? AND activity_id=\?/,'the server must verify real activity completion');
assert.match(server,/kind='daily-mission' AND reference_id=\?/,'mission reward claims must be idempotent');
assert.match(server,/claimDailyMission\(req\.session\.name\)/,'claims must use the authenticated student identity');
assert(!client.match(/body:.*stars/),'the client must never choose its own mission reward');
assert.match(client,/controller\.abort\(\),5000/,'mission requests need a timeout');
assert.match(client,/event\.key==='Escape'/,'escape/back must close only the mission panel');
assert(html.includes('<script src="daily-missions.js"></script>'),'daily mission UI must load');
console.log('student daily mission contract selftest passed');
