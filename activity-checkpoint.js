/* v0.9.39 local activity checkpoint foundation.
   Checkpoint keys use encoded identity parts so different student names/activity IDs cannot collapse into the same localStorage key. */
window.StudyVillageCheckpoint=(()=>{
  const PREFIX='studyvillage-checkpoint:v1:';
  const MAX_AGE_MS=604800000;
  const part=s=>encodeURIComponent(String(s||'').trim()).slice(0,240);
  const key=(playerName,activityId)=>`${PREFIX}${part(playerName)}:${part(activityId)}`;
  function valid(value){
    if(!value||value.version!==1||!value.updatedAt)return false;
    const age=Date.now()-Date.parse(value.updatedAt);
    return Number.isFinite(age)&&age>=0&&age<=MAX_AGE_MS;
  }
  function save(playerName,activityId,progress={}){
    if(!playerName||!activityId)return false;
    const value={version:1,playerName:String(playerName),activityId:String(activityId),progress,updatedAt:new Date().toISOString()};
    try{localStorage.setItem(key(playerName,activityId),JSON.stringify(value));return true}catch{return false}
  }
  function load(playerName,activityId){
    if(!playerName||!activityId)return null;
    const k=key(playerName,activityId);
    try{const value=JSON.parse(localStorage.getItem(k)||'null');if(valid(value)&&value.playerName===String(playerName)&&value.activityId===String(activityId))return value;localStorage.removeItem(k);return null}catch{try{localStorage.removeItem(k)}catch{}return null}
  }
  function clear(playerName,activityId){if(!playerName||!activityId)return;try{localStorage.removeItem(key(playerName,activityId))}catch{}}
  function list(playerName){
    const out=[];if(!playerName)return out;
    const expectedPlayer=String(playerName),prefix=`${PREFIX}${part(playerName)}:`;
    try{for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i);if(!k?.startsWith(prefix))continue;try{const value=JSON.parse(localStorage.getItem(k)||'null');if(valid(value)&&value.playerName===expectedPlayer)out.push(value);else localStorage.removeItem(k)}catch{localStorage.removeItem(k)}}}catch{}
    return out.sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
  }
  return{save,load,clear,list,maxAgeMs:MAX_AGE_MS};
})();