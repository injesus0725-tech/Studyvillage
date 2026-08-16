const fs=require('fs'),assert=require('assert');
for(const file of ['village-layout.js','random-exploration-events.js','daily-missions.js','exploration-collection.js']){
  const src=fs.readFileSync(file,'utf8'),success=src.indexOf("window.dispatchEvent(new Event('studyvillage:stars-refresh'))"),failure=src.indexOf('catch',success);
  assert.ok(success>=0,`${file} must refresh shared star consumers after a confirmed reward`);
  assert.ok(success<failure,`${file} must not refresh stars from its failure branch`);
  assert.ok(src.indexOf('await response.json')<success||src.indexOf('const result=await save(score)')<success,`${file} must wait for the server response before refreshing`);
}
console.log('exploration star refresh contract self-test passed');
