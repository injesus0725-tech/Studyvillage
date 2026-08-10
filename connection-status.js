/* v0.9.4 classroom connection status notice.
   This module only informs students about connectivity. It never changes scores, XP, or activity data. */
(()=>{
  const game=document.querySelector('#game-screen');
  if(!game)return;
  const banner=document.createElement('div');
  banner.id='connection-status-banner';
  banner.setAttribute('role','status');
  banner.setAttribute('aria-live','polite');
  banner.hidden=true;
  banner.innerHTML='<strong></strong><span></span>';
  document.body.appendChild(banner);

  const style=document.createElement('style');
  style.textContent=`
    #connection-status-banner{position:fixed;left:50%;top:72px;z-index:10050;transform:translateX(-50%);width:min(620px,calc(100vw - 24px));padding:11px 14px;border-radius:14px;box-shadow:0 8px 24px #263b2c35;font-size:13px;text-align:center}
    #connection-status-banner strong{display:block;margin-bottom:2px;font-size:14px}
    #connection-status-banner.offline{background:#fff0e8;border:2px solid #efb493;color:#7d4026}
    #connection-status-banner.online{background:#eaf8ed;border:2px solid #b8dfc0;color:#285f37}
  `;
  document.head.appendChild(style);

  let lastState=null,restoredTimer=null,checking=false;
  function show(type,title,detail,autoHide=false){
    banner.className=type;banner.querySelector('strong').textContent=title;banner.querySelector('span').textContent=detail;banner.hidden=false;
    clearTimeout(restoredTimer);
    if(autoHide)restoredTimer=setTimeout(()=>{banner.hidden=true},3500);
  }
  function setState(online){
    if(lastState===online)return;
    const previous=lastState;lastState=online;
    if(!online){
      show('offline','⚠️ 교실 서버 연결이 끊겼어요','화면은 그대로 두고 선생님께 알려 주세요. 연결이 돌아오면 자동으로 다시 확인합니다.');
    }else if(previous===false){
      show('online','✅ 교실 서버가 다시 연결됐어요','이제 계속 활동할 수 있어요.',true);
    }else{
      banner.hidden=true;
    }
  }
  async function check(){
    if(checking||!game.classList.contains('active'))return;
    checking=true;
    try{
      if(!navigator.onLine){setState(false);return}
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),3000);
      try{const r=await fetch('/api/health',{cache:'no-store',signal:controller.signal});setState(r.ok)}catch{setState(false)}finally{clearTimeout(timeout)}
    }finally{checking=false}
  }
  window.addEventListener('offline',()=>setState(false));
  window.addEventListener('online',check);
  const observer=new MutationObserver(()=>{if(game.classList.contains('active'))check();else banner.hidden=true});
  observer.observe(game,{attributes:true,attributeFilter:['class']});
  setInterval(check,8000);
})();