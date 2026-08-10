/* v0.9.28 data service. Classroom server is the source of truth; local storage is fallback only.
   Player load/save/ranking requests use short timeouts so a partially stalled classroom server cannot freeze student record screens. */
window.StudyVillageData=(()=>{
  const prefix='studyvillage-player:',key=n=>`${prefix}${n}`,REQUEST_TIMEOUT_MS=5000;
  const empty=()=>({totalScore:0,attempts:0,bestScore:0,lastScore:0,xp:0,level:1,xpIntoLevel:0,xpToNext:200,updatedAt:null});
  async function ready(){return window.StudyVillageAuth?.checkServer?window.StudyVillageAuth.checkServer():false}
  async function timedFetch(url,options={}){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);try{return await fetch(url,{...options,signal:controller.signal})}finally{clearTimeout(timeout)}}
  async function loadPlayer(name){
    if(await ready())try{const r=await timedFetch('/api/player/me',{cache:'no-store',headers:window.StudyVillageAuth.authHeaders()});if(r.ok)return{...empty(),...((await r.json()).player||{})}}catch{}
    try{const raw=localStorage.getItem(key(name));return raw?{...empty(),...JSON.parse(raw)}:empty()}catch{return empty()}
  }
  async function savePlayer(name,record){
    const payload={totalScore:Number(record.totalScore)||0,attempts:Number(record.attempts)||0,bestScore:Number(record.bestScore)||0,lastScore:Number(record.lastScore)||0};
    if(await ready())try{const r=await timedFetch('/api/player/me/record',{method:'POST',headers:{'Content-Type':'application/json',...window.StudyVillageAuth.authHeaders()},body:JSON.stringify(payload)});if(r.ok)return{...empty(),...((await r.json()).player||{})}}catch{}
    const xp=Number(record.xp)||0,local={...payload,xp,level:Math.floor(xp/200)+1,xpIntoLevel:xp%200,xpToNext:200,updatedAt:new Date().toISOString()};localStorage.setItem(key(name),JSON.stringify(local));return local
  }
  async function listPlayers(){
    if(await ready())try{const r=await timedFetch('/api/ranking',{cache:'no-store'});if(r.ok)return(await r.json()).players||[]}catch{}
    const players=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k?.startsWith(prefix))continue;try{players.push({name:k.slice(prefix.length),...JSON.parse(localStorage.getItem(k))})}catch{}}return players
  }
  return{loadPlayer,savePlayer,listPlayers,mode:async()=>await ready()?'classroom-server':'local'}
})();