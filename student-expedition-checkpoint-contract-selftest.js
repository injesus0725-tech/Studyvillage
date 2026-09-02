const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('assets/student-study-menu.js','utf8');

assert.ok(src.includes("next.textContent=index===active.count-1?'탐험 결과 보기 🏁':'다음 지역으로 ▶'"),'correct answers must expose either the next region or final result');
assert.ok(src.includes("next.onclick=()=>index===active.count-1?finish():nextStage()"),'the last room must finish and earlier rooms must advance');
assert.ok(src.includes('function nextStage(){index++;resolved=false;eventForStage=null;eventClaimed=false;renderMap()}'),'advancing must reset the room state and render a new map');
assert.ok(src.includes("eventButton.onclick=()=>claimDiscovery(eventButton)"),'discoveries must be explicitly claimable before leaving the room');
assert.ok(src.includes("fetchJson('/api/player/me/exploration-event'"),'discovery rewards must be saved through the authenticated exploration event API');
assert.ok(src.includes("const result=active.kind==='math'?await saveMath():await saveRiddle()"),'final result must save through the correct subject flow');
assert.ok(src.includes("resultBox.querySelector('button').onclick=returnVillage"),'successful completion must offer a direct return to the village');
assert.ok(src.includes("function returnVillage(){stage.hidden=true;hub.hidden=true;document.body.classList.remove('study-expedition-active')"),'returning must close expedition overlays and release the expedition activity lock');
assert.ok(src.includes("questions=[];firstAnswers=[];firstResults=[];mathSessionId='';submissionId=''"),'returning must discard per-run expedition state');
assert.ok(src.includes("resultBox.querySelector('button').onclick=()=>{saving=false;finish()}"),'transient save failure must keep an explicit retry path');
assert.ok(src.includes("if(saving)return"),'duplicate finish/save actions must be suppressed while saving');

console.log('student unified expedition progression contract selftest passed');
