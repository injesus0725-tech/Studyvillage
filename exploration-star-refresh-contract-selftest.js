const fs=require('fs'),assert=require('assert');
const v2=fs.readFileSync('assets/student-exploration-v2.js','utf8');
assert.ok(v2.includes("studyvillage:stars-refresh"),'exploration v2 must refresh shared star consumers after a confirmed reward');
assert.ok(v2.includes('/api/player/me/activity'),'exploration v2 must save the completed expedition through the server before reward refresh');
for(const file of ['random-exploration-events.js','daily-missions.js','exploration-collection.js']){
  const src=fs.readFileSync(file,'utf8');
  assert.ok(src.includes("studyvillage:stars-refresh"),`${file} must refresh shared star consumers after a confirmed reward`);
}
const layout=fs.readFileSync('village-layout.js','utf8');
assert.ok(!layout.includes("studyvillage:stars-refresh"),'village layout must not retain legacy expedition reward ownership');
console.log('exploration v2 star refresh contract self-test passed');
