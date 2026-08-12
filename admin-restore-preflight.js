/* v1.9 admin restore preflight fetch gate.
   Intercepts only /api/admin/restore and validates the exact request body first.
   Other fetch calls pass through unchanged. */
(()=>{
  const originalFetch=window.fetch.bind(window);
  const REQUEST_TIMEOUT_MS=5000;
  let preflighting=false;
  window.fetch=async function(input,init={}){
    const url=typeof input==='string'?input:input?.url||'';
    const method=String(init?.method||'GET').toUpperCase();
    if(preflighting||method!=='POST'||!String(url).includes('/api/admin/restore'))return originalFetch(input,init);
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);
    try{
      preflighting=true;
      const preflight=await originalFetch('/api/admin/restore-preflight',{
        method:'POST',
        headers:init?.headers,
        body:init?.body,
        cache:'no-store',
        signal:controller.signal
      });
      const result=await preflight.clone().json().catch(()=>({}));
      if(!preflight.ok||!result?.ok){
        const message=result?.message||'복원 파일이 안전 검사를 통과하지 못했습니다.';
        alert(`복원을 시작하지 않았습니다.\n\n${message}\n\n기존 교실 데이터는 변경되지 않았습니다.`);
        return new Response(JSON.stringify({ok:false,code:result?.code||'restore-preflight-failed',message}),{
          status:400,
          headers:{'Content-Type':'application/json'}
        });
      }
      return originalFetch(input,init);
    }catch(error){
      const message=error?.name==='AbortError'?'복원 사전검사 시간이 초과되어 실제 복원을 시작하지 않았습니다.':'복원 사전검사를 완료하지 못해 실제 복원을 시작하지 않았습니다.';
      alert(`${message}\n\n기존 교실 데이터는 변경되지 않았습니다.`);
      return new Response(JSON.stringify({ok:false,code:error?.name==='AbortError'?'restore-preflight-timeout':'restore-preflight-unavailable',message}),{
        status:503,
        headers:{'Content-Type':'application/json'}
      });
    }finally{
      clearTimeout(timeout);
      preflighting=false;
    }
  };
})();
