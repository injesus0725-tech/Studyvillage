const fs=require('fs'),assert=require('assert'),vm=require('vm');
for(const file of ['server/server.js','server/riddle-attempt-student.js','data-service.js','game.js']){const src=fs.readFileSync(file,'utf8');assert.ok(src.includes('return 200*n+25*n*(n-1)'),`${file} must use the shared progression formula`);assert.ok(src.includes('xpToNext:next-start'),`${file} must return the current level span`)}
const source=fs.readFileSync('server/server.js','utf8'),start=source.indexOf('const xpForLevel='),end=source.indexOf(';\nfunction rewardsFor',start),code=source.slice(start,end)+';this.result={xpForLevel,levelFromXp,progressFromXp};';const box={};vm.runInNewContext(code,box);const {xpForLevel,levelFromXp,progressFromXp}=box.result;
assert.deepEqual([1,2,3,4,5,6].map(xpForLevel),[0,200,450,750,1100,1500],'level thresholds must preserve easy early growth and rise by 50 XP per level');
assert.equal(levelFromXp(199),1);assert.equal(levelFromXp(200),2);assert.equal(levelFromXp(449),2);assert.equal(levelFromXp(450),3);
assert.deepEqual({...progressFromXp(500)},{level:3,xpIntoLevel:50,xpToNext:300},'progress must be relative to the active level threshold');
console.log('student progressive XP curve contract self-test passed');
