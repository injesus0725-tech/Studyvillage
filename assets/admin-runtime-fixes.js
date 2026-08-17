/* Runtime reliability fixes for teacher write actions + physical delivery notifications. */
(()=>{
  const app=document.querySelector('#admin-app');if(!app)return;
  const token=()=>sessionStorage.getItem('studyvillage-admin-token')||'';
  const headers=()=>({Authorization:`Bearer ${token()}`,'Content-Type':'application/json'});
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function api(url,{method='GET',body}={}){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);
    try{
      const response=await fetch(url,{method,headers:headers(),body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',signal:controller.signal});
      const data=await response.json().catch(()=>({}));
      if(response.status===401){sessionStorage.removeItem('studyvillage-admin-token');throw Object.assign(new Error('관리자 로그인이 만료되었습니다.'),{auth:true})}
      if(!response.ok||data.ok===false)throw new Error(data.message||data.code||`요청 실패 (${response.status})`);
      return data;
    }finally{clearTimeout(timer)}
  }
  function refresh(){document.querySelector('#refresh-button')?.click()}
  const reason=label=>{const value=prompt(`${label} 이유를 3자 이상 입력하세요.`,'교사 확인 후 수정');if(value===null)return null;const text=value.trim();if(text.length<3){alert('이유를 3자 이상 입력해 주세요.');return null}return text}
  async function run(button,job){if(button.disabled)return;button.disabled=true;try{await job();refresh()}catch(error){alert(`처리하지 못했습니다.\n${error?.message||error}`);if(error?.auth)location.reload()}finally{button.disabled=false}}

  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    const name=button.dataset.name||button.dataset.xpName||button.dataset.titleName||button.dataset.renameName||button.dataset.equipmentName;
    const password=button.dataset.action==='password';
    const xp=button.hasAttribute('data-xp-name'),title=button.hasAttribute('data-title-name'),rename=button.hasAttribute('data-rename-name'),equipment=button.hasAttribute('data-equipment-name');
    if(!name||(!password&&!xp&&!title&&!rename&&!equipment))return;
    event.preventDefault();event.stopImmediatePropagation();
    if(password){
      const value=prompt(`${name} 학생의 새 비밀번호를 입력하세요. (4~72자)`);if(value===null)return;if(value.length<4||value.length>72)return alert('비밀번호는 4~72자로 입력해 주세요.');
      if(!confirm(`${name} 학생의 비밀번호를 변경할까요?\n기존 학생 로그인은 종료됩니다.`))return;
      run(button,async()=>{await api(`/api/admin/player/${encodeURIComponent(name)}/reset-password`,{method:'POST',body:{password:value}});alert('학생 비밀번호를 변경했습니다.')});return;
    }
    if(xp){
      const raw=prompt(`${name} 학생의 최종 XP를 입력하세요. (0~1,000,000)`);if(raw===null)return;const value=Number(raw.trim());if(!Number.isInteger(value)||value<0||value>1000000)return alert('XP는 0~1,000,000 사이 정수로 입력해 주세요.');const why=reason('XP 수정');if(!why)return;
      if(!confirm(`${name} 학생의 XP를 ${value} XP로 수정할까요?`))return;
      run(button,async()=>{await api(`/api/admin/player/${encodeURIComponent(name)}/xp`,{method:'POST',body:{xp:value,reason:why}});alert('XP를 수정했습니다.')});return;
    }
    if(title){
      const raw=prompt(`${name} 학생의 칭호를 입력하세요. (2~15자)`);if(raw===null)return;const value=raw.trim().replace(/\s+/g,' ');if(value.length<2||value.length>15||!/^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 ]+$/.test(value))return alert('칭호는 한글·영문·숫자·공백으로 2~15자 입력해 주세요.');const why=reason('칭호 수정');if(!why)return;
      run(button,async()=>{const data=await api(`/api/admin/player/${encodeURIComponent(name)}/custom-title`,{method:'POST',body:{title:value,reason:why}});alert(data.visible?'칭호를 수정했습니다.':'칭호를 저장했습니다. 학생 화면 표시 조건에 따라 보일 수 있습니다.')});return;
    }
    if(rename){
      const raw=prompt(`${name} 학생의 새 이름을 입력하세요. (12자 이내)`,name);if(raw===null)return;const value=raw.trim().replace(/\s+/g,' ');if(!value||value.length>12||value===name)return alert('현재 이름과 다른 12자 이내 이름을 입력해 주세요.');const why=reason('이름 수정');if(!why)return;
      if(!confirm(`${name} 학생의 이름을 “${value}”로 바꿀까요?\n활동·별·아이템 기록도 함께 이동합니다.`))return;
      run(button,async()=>{await api(`/api/admin/player/${encodeURIComponent(name)}/rename`,{method:'POST',body:{newName:value,reason:why}});alert('학생 이름을 변경했습니다.')});return;
    }
    if(equipment){
      const why=reason('꾸미기 복구');if(!why)return;if(!confirm(`${name} 학생의 장착 상태를 기본 모습으로 복구할까요?\n구매한 아이템과 별은 유지됩니다.`))return;
      run(button,async()=>{await api(`/api/admin/player/${encodeURIComponent(name)}/reset-equipment`,{method:'POST',body:{reason:why}});alert('꾸미기 장착 상태를 복구했습니다.')});
    }
  },true);

  const notice=document.createElement('button');notice.type='button';notice.id='admin-delivery-notice';notice.hidden=true;notice.style.cssText='position:fixed;right:18px;bottom:18px;z-index:9999;padding:13px 17px;border:0;border-radius:999px;background:#fff0ad;color:#674d00;font-weight:900;box-shadow:0 8px 28px #0002;cursor:pointer';document.body.appendChild(notice);
  let previousPending=0,polling=false;
  function showPending(count){notice.hidden=count<1;notice.textContent=`📦 전달 요청 ${count}건`;notice.dataset.count=String(count)}
  notice.addEventListener('click',()=>{document.querySelector('#shop-admin-panel')?.scrollIntoView({behavior:'smooth',block:'start'});refresh()});
  async function pollDeliveries(){if(polling||!token()||app.hidden||document.hidden)return;polling=true;try{const data=await api('/api/admin/shop');const count=Math.max(0,Number(data.pendingDeliveryCount)||0);showPending(count);if(count>previousPending&&previousPending>=0){notice.animate?.([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:650});}previousPending=count}catch{}finally{polling=false}}
  setInterval(pollDeliveries,5000);window.addEventListener('focus',pollDeliveries);document.addEventListener('visibilitychange',()=>{if(!document.hidden)pollDeliveries()});new MutationObserver(()=>{if(!app.hidden){wait(300).then(pollDeliveries)}}).observe(app,{attributes:true,attributeFilter:['hidden']});pollDeliveries();
})();
