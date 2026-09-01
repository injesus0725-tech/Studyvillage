/* v1.9 end-to-end teacher self-test for student error reporting. Creates and removes a temporary student automatically. */
(()=>{
  const app=document.querySelector('#admin-app');if(!app)return;
  const adminToken=()=>sessionStorage.getItem('studyvillage-admin-token')||'';
  const adminHeaders=()=>adminToken()?{Authorization:`Bearer ${adminToken()}`}:{},REQUEST_TIMEOUT_MS=7000;
  const panel=()=>[...app.querySelectorAll('.panel')].find(node=>node.textContent.includes('자동 오류 수집'));
  let running=false;
  async function request(url,options={}){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);try{return await fetch(url,{cache:'no-store',...options,signal:controller.signal})}finally{clearTimeout(timer)}}
  async function run(button,status){if(running||!adminToken())return;running=true;button.disabled=true;button.textContent='자가점검 중…';status.textContent='임시 학생 계정을 만들어 실제 오류 전송 경로를 확인하고 있습니다.';
    const stamp=Date.now().toString(36).slice(-7),name=`점검${stamp}`.slice(0,12),password=`T${stamp}9!`,reportId=`selftest-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;let studentToken='';
    try{
      const login=await request('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,password})}),loginData=await login.json();if(!login.ok||!loginData.ok||!loginData.token)throw new Error('임시 학생 로그인 실패');studentToken=loginData.token;
      const report={id:reportId,at:new Date().toISOString(),version:'1.9.0',kind:'self-test',message:'관리자 오류 수집 자가점검',stack:'',page:'/admin-self-test',online:navigator.onLine,mode:'self-test',userAgent:navigator.userAgent,extra:{selfTest:true},recentEvents:[{at:new Date().toISOString(),type:'self-test',detail:'student-to-server-to-admin',page:'/admin'}]};
      const sent=await request('/api/error-report',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${studentToken}`},body:JSON.stringify(report)});if(!sent.ok)throw new Error('오류 보고 전송 실패');
      const listed=await request('/api/admin/errors',{headers:adminHeaders()}),listData=await listed.json();if(!listed.ok||!listData.ok)throw new Error('관리자 오류 목록 조회 실패');const found=(listData.errors||[]).some(row=>row.reportId===reportId&&row.playerName===name&&row.kind==='self-test');if(!found)throw new Error('전송된 오류가 관리자 목록에서 확인되지 않음');
      status.textContent='✅ 정상: 학생 오류 생성 → 서버 저장 → 관리자 조회까지 모두 확인했습니다. 임시 데이터도 정리했습니다.';
    }catch(error){status.textContent=`❌ 점검 실패: ${String(error?.message||error).slice(0,160)} · 진단 파일을 내보내 확인하세요.`;
    }finally{
      try{await request(`/api/admin/player/${encodeURIComponent(name)}`,{method:'DELETE',headers:adminHeaders()})}catch{}
      running=false;button.disabled=false;button.textContent='🧪 오류 수집 자가점검';
      document.querySelector('#teacher-error-refresh')?.click();
    }
  }
  function mount(){const target=panel();if(!target||target.querySelector('#teacher-error-selftest'))return;const actions=target.querySelector('.panel-head .actions');if(!actions)return;const button=document.createElement('button');button.id='teacher-error-selftest';button.type='button';button.textContent='🧪 오류 수집 자가점검';const status=document.createElement('p');status.id='teacher-error-selftest-status';status.style.cssText='margin:0 22px 14px;color:#607266;font-weight:800';status.textContent='학생 적용 전 실제 오류 수집 경로를 한 번에 확인할 수 있습니다.';actions.appendChild(button);target.querySelector('.panel-head')?.after(status);button.addEventListener('click',()=>run(button,status))}
  const observer=new MutationObserver(mount);observer.observe(app,{childList:true,subtree:true});mount();
})();
