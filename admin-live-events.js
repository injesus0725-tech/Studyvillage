/* v0.9.16 teacher live classroom broadcast control */
(()=>{
  const app=document.querySelector('#admin-app');if(!app)return;
  const token=()=>sessionStorage.getItem('studyvillage-admin-token')||'';
  const section=document.createElement('section');section.className='panel';section.innerHTML=`<div class="panel-head"><div><h2>📣 실시간 마을 방송</h2><p>현재 접속 중인 학생에게만 상단 알림을 보냅니다. 늦게 접속한 학생에게는 다시 표시되지 않습니다.</p></div></div><div style="display:flex;gap:8px;flex-wrap:wrap;padding:4px 22px 22px"><input id="live-broadcast-message" maxlength="160" placeholder="예: 오늘도 멋지게 도전하고 있어요!" style="flex:1;min-width:260px;padding:11px 12px;border:1px solid #d8e2d9;border-radius:10px"><button id="live-broadcast-send">✨ 방송 보내기</button><button id="live-broadcast-test">⭐ 테스트</button><span id="live-broadcast-result" style="align-self:center;font-weight:800;color:#607266"></span></div>`;
  const presence=[...app.querySelectorAll('.panel')].find(p=>p.textContent.includes('현재 접속 현황'));if(presence)presence.after(section);else app.prepend(section);
  const input=section.querySelector('#live-broadcast-message'),send=section.querySelector('#live-broadcast-send'),test=section.querySelector('#live-broadcast-test'),result=section.querySelector('#live-broadcast-result');
  async function publish(message,icon='✨'){
    if(!token()||!message.trim())return;
    result.textContent='보내는 중…';
    try{const r=await fetch('/api/admin/live-events',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token()}`},body:JSON.stringify({message:message.trim(),icon,type:'teacher-announcement'})});const d=await r.json();if(!r.ok)throw new Error();result.textContent=`현재 접속 ${d.recipients||0}명에게 전송 ✓`;if(r.ok)input.value=''}catch{result.textContent='방송을 보내지 못했습니다.'}
  }
  send.onclick=()=>publish(input.value,'📣');
  test.onclick=()=>publish('실시간 마을 알림이 정상적으로 연결되었습니다!','⭐');
  input.addEventListener('keydown',e=>{if(e.key==='Enter')publish(input.value,'📣')});
})();