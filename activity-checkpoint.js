/* v0.9.29 local activity checkpoint foundation.
   Progress is stored only on the student's device until a server-confirmed activity completion clears it.
   Checkpoints are temporary progress, never confirmed XP/score/currency. */
window.StudyVillageCheckpoint=(()=>{
  const PREFIX='studyvillage-checkpoint:v1:';
  const safe=s=>String(s||'').trim().replace(/[^a-zA-Z0-9._:-]/g,'_').slice(0,80);
  const key=(playerName,activityId)=>`${PREFIX}${safe(playerName)}:${safe(activityId)}`;
  function save(playerName,activityId,progress={}){
    if(!playerName||!activityId)return false;
    const value={version:1,playerName:String(playerName),activityId:String(activityId),progress,updatedAt:new Date().toISOString()};
    try{localStorage.setItem(key(playerName,activityId),JSON.stringify(value));return true}catch{return false}
  }
  function load(playerName,activityId){
    if(!playerName||!activityId)return null;
    try{const value=JSON.parse(localStorage.getItem(key(playerName,activityId))||'null');return value?.version===1?value:null}catch{return null}
  }
  function clear(playerName,activityId){
    if(!playerName||!activityId)return;
    try{localStorage.removeItem(key(playerName,activityId))}catch{}
  }
  function list(playerName){
    const out=[];if(!playerName)return out;
    const prefix=`${PREFIX}${safe(playerName)}:`;
    try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k?.startsWith(prefix))continue;try{const value=JSON.parse(localStorage.getItem(k)||'null');if(value?.version===1)out.push(value)}catch{}}}catch{}
    return out.sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
  }
  return{save,load,clear,list};
})();