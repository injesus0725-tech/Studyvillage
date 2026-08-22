const fs=require('fs'),assert=require('assert');
for(const file of ['assets/student-study-menu.js','random-exploration-events.js','daily-missions.js','exploration-collection.js']){
  const src=fs.readFileSync(file,'utf8'),success=src.indexOf("window.dispatchEvent(new Event('studyvillage:stars-refresh'))"),failure=src.indexOf('catch',success);
  assert.ok(success>=0,`${file} must refresh shared star consumers after a confirmed reward`);
  assert.ok(failure<0||success<failure,`${file} must not refresh stars from its failure branch`);
  assert.ok(src.indexOf('await response.json')<success||src.indexOf('const result=await save(score)')<success||src.indexOf('await fetchJson')<success,`${file} must wait for the server response before refreshing`);
}
const layout=fs.readFileSync('village-layout.js','utf8');
assert.ok(!layout.includes("studyvillage:stars-refresh"),'village layout must not retain legacy expedition reward ownership');
console.log('unified exploration star refresh contract self-test passed');
