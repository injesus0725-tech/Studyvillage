const fs=require('fs'),assert=require('assert');
for(const file of ['village-layout.js','daily-missions.js','exploration-collection.js']){
  const src=fs.readFileSync(file,'utf8'),success=src.indexOf("window.dispatchEvent(new Event('studyvillage:stars-refresh'))"),failure=src.indexOf('catch',success);
  assert.ok(success>=0,`${file} must refresh shared star consumers after a confirmed reward`);
  assert.ok(failure<0||success<failure,`${file} must not refresh stars from its failure branch`);
  assert.ok(src.indexOf('await response.json')<success||src.indexOf('const result=await save(score)')<success,`${file} must wait for the server response before refreshing`);
}
const catalog=fs.readFileSync('random-exploration-events.js','utf8');
assert.ok(catalog.includes('StudyVillageExpeditionEvents')&&!catalog.includes("studyvillage:stars-refresh"),'random exploration events must remain a data-only catalog; the expedition runtime owns confirmed rewards and refresh events');
console.log('exploration star refresh ownership contract self-test passed');
