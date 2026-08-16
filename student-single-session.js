/* A student account may be active on only one classroom device at a time. */
(()=>{
  const NOTICE_KEY='studyvillage-session-replaced-notice',message='같은 학생 계정이 다른 패드에서 로그인되어 이 패드의 접속이 종료되었습니다.';
  const notice=sessionStorage.getItem(NOTICE_KEY);if(notice){sessionStorage.removeItem(NOTICE_KEY);setTimeout(()=>{const target=document.querySelector('#name-error');if(target)target.textContent=notice},0)}
  const originalFetch=window.fetch.bind(window);let handling=false;
  window.fetch=async(...args)=>{const response=await originalFetch(...args);if(!handling&&response.status===401){try{const result=await response.clone().json();if(result?.code==='session-replaced'){handling=true;sessionStorage.setItem(NOTICE_KEY,message);window.StudyVillageAuth?.clearSession?.();location.reload()}}catch{}}return response};
})();
