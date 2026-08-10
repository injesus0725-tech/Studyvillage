/* v0.9.20 teacher live classroom broadcast control.
   Shows the current live recipient count before sending, while preserving the
   v0.9.19 resend guard, one-request-at-a-time rule, and draft-safe test button. */
(()=>{
  const app=document.querySelector('#admin-app');if(!app)return;
  const token=()=>sessionStorage.getItem('studyvillage-admin-token')||'';
  const section=document.createElement('section');section.className='panel';section.innerHTML=`<div class="panel-head"><div><h2>📣 실시간 마을 방송</h2><p>현재 접속 중인 학생에게만 상단 알림을 보냅니다. 늦게 접속한 학생에게는 다시 표시되지 않습니다.</p></div><span id="live-broadcast-audience" class="overview-count">접속 확인 중…</span></div><div style="display:flex;gap:8px;flex-wrap:wrap;padding:4px 22px 22px"><input id="live-broadcast-message" maxlength="160" placeholder="예: 오늘도 멋지게 도전하고 있어요!" style="flex:1;min-width:260px;padding:11px 12px;border:1px solid #d8e2d9;border-radius:10px"><button id="live-broadcast-send">✨ 방송 보내기</button><button id="live-broadcast-test">⭐ 테스트</button><span id="live-broadcast-result" style="align-self:center;font-weight:800;color:#607266"></span></div>`;
  const presence=[...app.querySelectorAll('.panel')].find(p=>p.textContent.includes('현재 접속 현황'));if(presence)presence.after(section);else app.prepend(section);
  const input=section.querySelector('#live-broadcast-message'),send=section.querySelector('#live-broadcast-send'),test=section.querySelector('#live-broadcast-test'),result=section.querySelector('#live-broadcast-result'),audience=section.querySelector('#live-broadcast-audience');
  const RESEND_GUARD_MS=2000,AUDIENCE_REFRESH_MS=10000;let sending=false,lastSentAt=0,audienceTimer=null;
  function setBusy(value){sending=value;send.disabled=value;test.disabled=value}
  async function refreshAudience(){
    if(!token()||app.hidden)return;
    try{const r=await fetch('/api/admin/presence',{headers:{Authorization:`Bearer ${token()}`},cache:'no-store'});if(!r.ok)throw new Error();const d=await r.json(),online=(d.players||[]).filter(p=>p.status==='online').length;audience.textContent=online>0?`🟢 지금 ${online}명에게 전송`:'⚪ 지금 전송 대상 0명';audience.title='학생 heartbeat 기준 현재 접속 인원'}catch{audience.textContent='접속 인원 확인 안 됨'}
  }
  async function publish(message,icon='✨',{clearDraft=true}={}){
    const text=String(message||'').trim();if(!token()||!text)return;
    const now=Date.now();if(sending||now-lastSentAt<RESEND_GUARD_MS){result.textContent='잠시 후 다시 보내 주세요.';return}
    setBusy(true);result.textContent='보내는 중…';
    try{
      const r=await fetch('/api/admin/live-events',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token()}`},body:JSON.stringify({message:text,icon,type:'teacher-announcement'})}),d=await r.json();if(!r.ok)throw new Error();
      lastSentAt=Date.now();
      result.textContent=(d.recipients||0)>0?`현재 접속 ${d.recipients}명에게 전송 ✓`:'현재 접속 중인 학생이 없어 전송 대상이 없습니다.';
      if(clearDraft&&d.recipients>0)input.value='';
      refreshAudience();
    }catch{result.textContent='방송을 보내지 못했습니다.'}finally{setBusy(false)}
  }
  send.onclick=()=>publish(input.value,'📣',{clearDraft:true});
  test.onclick=()=>publish('실시간 마을 알림이 정상적으로 연결되었습니다!','⭐',{clearDraft:false});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();publish(input.value,'📣',{clearDraft:true})}});
  const observer=new MutationObserver(()=>{if(!app.hidden)refreshAudience()});observer.observe(app,{attributes:true,attributeFilter:['hidden']});
  refreshAudience();audienceTimer=setInterval(refreshAudience,AUDIENCE_REFRESH_MS);
  window.addEventListener('beforeunload',()=>{if(audienceTimer)clearInterval(audienceTimer)});
})();