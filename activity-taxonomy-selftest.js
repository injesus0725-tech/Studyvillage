/* v1.9 read-only contract test for activity taxonomy and question metadata.
   Never edits question, score, or player data. */
import fs from 'node:fs';
import vm from 'node:vm';

function loadBrowserScript(path){
  const window={};
  const context=vm.createContext({window,Object,String});
  vm.runInContext(fs.readFileSync(new URL(path,import.meta.url),'utf8'),context,{filename:path});
  return window;
}

const taxonomyWindow=loadBrowserScript('./activity-taxonomy.js');
const questionWindow=loadBrowserScript('./question-data.js');
const taxonomy=taxonomyWindow.StudyVillageActivityTaxonomy||{};
const sets=questionWindow.StudyVillageQuestionSets||{};
const errors=[];

for(const [setKey,set] of Object.entries(sets)){
  const activityId=String(set?.activityId||'').trim();
  if(!activityId){errors.push(`${setKey}: activityId 없음`);continue}
  const meta=taxonomy[activityId];
  if(!meta){errors.push(`${setKey}: taxonomy에 ${activityId} 없음`);continue}
  if(String(meta.subject||'')!==String(set.subject||''))errors.push(`${activityId}: subject 불일치 (${meta.subject} / ${set.subject})`);
  if(String(meta.topic||'')!==String(set.topic||''))errors.push(`${activityId}: topic 불일치 (${meta.topic} / ${set.topic})`);
}

if(errors.length){
  console.error('[activity-taxonomy-selftest] FAIL');
  for(const error of errors)console.error(`- ${error}`);
  process.exit(1);
}
console.log(`[activity-taxonomy-selftest] OK (${Object.keys(sets).length} question set)`);
