/* v0.9.25 classroom connection status + shared activity guard state.
   Health polling runs only while the student game is visible and active. Returning
   to the tab refreshes server state immediately without changing scored activity guards. */
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
    body.studyvillage-offline .interior-primary[data-requires-server="true"]{opacity:.55;cursor:not-allowed}
  `;
  document.head.appendChild(style);

  const CHECK_MS=8000;let lastState=null,restoredTimer=null,checking=false,timer=null;
  function show(type,title,detail,autoHide=false){banner.className=type;banner.querySelector('strong').textContent=title;banner.querySelector('span').textContent=detail;banner.hidden=false;clearTimeout(restoredTimer);if(autoHide)restoredTimer=setTimeout(()=>{banner.hidden=true},3500)}
  function setState(online){
    if(lastState===online)return;
    const previous=lastState;lastState=online;
    document.body.classList.toggle('studyvillage-offline',!online);
    window.dispatchEvent(new CustomEvent('studyvillage:connection-change',{detail:{online}}));
    if(!online)show('offline','⚠️ 교실 서버 연결이 끊겼어요','화면은 그대로 두고 선생님께 알려 주세요. 연결이 돌아오면 자동으로 다시 확인합니다.');
    else if(previous===false)show('online','✅ 교실 서버가 다시 연결됐어요','이제 계속 활동할 수 있어요.',true);
    else banner.hidden=true;
  }
  async function check(){
    if(checking||document.hidden||!game.classList.contains('active'))return lastState;
    checking=true;
    try{
      if(!navigator.onLine){setState(false);return false}
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),3000);
      try{const r=await fetch('/api/health',{cache:'no-store',signal:controller.signal});setState(r.ok);return r.ok}catch{setState(false);return false}finally{clearTimeout(timeout)}
    }finally{checking=false}
  }
  function start(){if(timer||document.hidden||!game.classList.contains('active'))return;check();timer=setInterval(check,CHECK_MS)}
  function stop(){if(timer){clearInterval(timer);timer=null}}
  window.StudyVillageConnection={isOnline:()=>lastState!==false,check,requireOnline:async()=>{const online=await check();if(online===false)show('offline','⚠️ 지금은 학습 활동을 시작할 수 없어요','서버 연결이 돌아오면 다시 도전해 주세요. 이미 저장된 기록은 그대로 유지됩니다.');return online!==false}};
  window.addEventListener('offline',()=>{stop();setState(false)});
  window.addEventListener('online',start);
  window.addEventListener('focus',start);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});
  const observer=new MutationObserver(()=>{if(game.classList.contains('active'))start();else{stop();banner.hidden=true}});
  observer.observe(game,{attributes:true,attributeFilter:['class']});
  start();
})();