/* v0.9.45 student activity gate.
   Closed activities cannot start or resume. Existing checkpoints are preserved.
   Repeated taps/keys while the same gate check is running are ignored, and closed notices have a short cooldown.
   Gate input is ignored while another modal/panel is already open, preventing accidental background activity launches. */
(()=>{
  const activityState=()=>window.StudyVillageActivityState;
  let bypassRiddle=false,lastNoticeAt=0;const pending=new Set(),NOTICE_COOLDOWN_MS=1800;
  function blockedByPanel(){return[...document.querySelectorAll('#dialogue,#quiz-panel,#record-panel,#customize-panel,#library-game-panel')].some(el=>el&&!el.hidden)}
  function nearQuizHall(){const player=document.querySelector('#player'),hall=document.querySelector('#quiz-hall');if(!player||!hall)return false;const p=player.getBoundingClientRect(),h=hall.getBoundingClientRect();return Math.hypot(p.left+p.width/2-(h.left+h.width/2),p.top+p.height/2-(h.top+h.height/2))<170}
  async function allow(id,name){if(pending.has(id))return false;pending.add(id);try{const state=activityState();if(!state)return true;const result=await state.requireOpen(id,name);if(result.ok)return true;const now=Date.now();if(now-lastNoticeAt>=NOTICE_COOLDOWN_MS){lastNoticeAt=now;alert(result.message)}return false}finally{pending.delete(id)}}
  window.addEventListener('studyvillage:open-library-game',e=>{if(e.detail?.gateApproved)return;e.stopImmediatePropagation();if(blockedByPanel())return;(async()=>{if(await allow('library-vocabulary','책마루 · 낱말 뜻 맞추기'))window.dispatchEvent(new CustomEvent('studyvillage:open-library-game',{detail:{gateApproved:true}}))})()});
  window.addEventListener('keydown',e=>{if(bypassRiddle){bypassRiddle=false;return}if(e.code!=='Space'||!nearQuizHall()||blockedByPanel())return;e.preventDefault();e.stopImmediatePropagation();(async()=>{if(await allow('riddle-demo','도전관 · 수수께끼')){bypassRiddle=true;window.dispatchEvent(new KeyboardEvent('keydown',{key:' ',code:'Space',bubbles:true,cancelable:true}))}})()},true);
  document.addEventListener('click',e=>{const button=e.target.closest?.('#talk-button');if(!button||!nearQuizHall()||blockedByPanel())return;if(bypassRiddle){bypassRiddle=false;return}e.preventDefault();e.stopImmediatePropagation();(async()=>{if(await allow('riddle-demo','도전관 · 수수께끼')){bypassRiddle=true;button.click()}})()},true);
})();