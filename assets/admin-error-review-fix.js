/* Stabilization: encode grouped error keys before teacher review writes so slashes/newlines in the key cannot break the route. */
(()=>{
  const listSelector='#teacher-error-list';
  const token=()=>sessionStorage.getItem('studyvillage-admin-token')||'';
  const headers=()=>token()?{Authorization:`Bearer ${token()}`}:{};
  let busy=false;
  document.addEventListener('click',async event=>{
    const button=event.target.closest(`${listSelector} button[data-error-review]`);
    if(!button||busy)return;
    event.preventDefault();event.stopImmediatePropagation();
    const key=button.dataset.errorReview||'';
    if(!key)return alert('오류 묶음 정보를 찾지 못했습니다. 새로고침 후 다시 시도해 주세요.');
    const picked=prompt('오류 상태 번호를 입력하세요.\n\n1. 확인 중\n2. 해결됨\n3. 보류',button.dataset.errorStatus==='resolved'?'2':button.dataset.errorStatus==='ignored'?'3':'1');
    if(picked===null)return;
    const status=({1:'open',2:'resolved',3:'ignored'})[String(picked).trim()];
    if(!status)return alert('1, 2, 3 중 하나를 입력해 주세요.');
    const note=prompt('교사 메모를 입력하세요. (선택, 최대 500자)','');
    if(note===null)return;if(note.length>500)return alert('메모는 500자 이내로 입력해 주세요.');
    busy=true;button.disabled=true;
    try{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
      let response;
      try{response=await fetch(`/api/admin/errors/review/${encodeURIComponent(key)}`,{method:'PUT',headers:{...headers(),'Content-Type':'application/json'},body:JSON.stringify({status,note}),signal:controller.signal})}finally{clearTimeout(timer)}
      if(response.status===401){sessionStorage.removeItem('studyvillage-admin-token');throw new Error('admin-auth-expired')}
      if(!response.ok)throw new Error(`review-${response.status}`);
      button.dataset.errorStatus=status;
      button.textContent='저장됨 ✓';
      setTimeout(()=>document.querySelector('#teacher-error-refresh')?.click(),150);
    }catch(error){alert(error?.message==='admin-auth-expired'?'관리자 로그인이 만료되었습니다. 다시 로그인해 주세요.':'오류 상태·메모를 저장하지 못했습니다. 새로고침 후 다시 시도해 주세요.')}finally{busy=false;button.disabled=false}
  },true);
})();
