/* v0.9.15 live village event presentation layer.
   Live classroom announcements use a dedicated TOP lane.
   Quiz questions and answer feedback stay inside their own activity panels below,
   so celebration banners never cover problem text or feedback controls. */
(()=>{
  const queue=[];
  let showing=false;

  const style=document.createElement('style');
  style.textContent=`
    #studyvillage-live-events{position:fixed;left:50%;top:82px;transform:translateX(-50%);z-index:9998;width:min(92vw,620px);pointer-events:none;display:flex;justify-content:center;align-items:flex-start}
    #studyvillage-live-events .live-event-card{max-width:100%;padding:13px 18px;border-radius:18px;background:#fffdf2;border:2px solid #f0cf68;box-shadow:0 10px 28px #2d50382d;color:#2e4937;font-weight:900;text-align:center;opacity:0;transform:translateY(-12px);transition:opacity .22s ease,transform .22s ease}
    @media(max-width:760px){#studyvillage-live-events{top:116px;width:min(94vw,560px)}#studyvillage-live-events .live-event-card{padding:11px 14px;font-size:14px}}
  `;
  document.head.appendChild(style);

  const host=document.createElement('div');
  host.id='studyvillage-live-events';
  host.dataset.lane='top-announcement';
  host.setAttribute('aria-live','polite');
  document.body.appendChild(host);

  const card=document.createElement('div');
  card.className='live-event-card';
  card.hidden=true;
  host.appendChild(card);

  const safe=v=>String(v??'').slice(0,160);
  function next(){
    if(showing||!queue.length)return;
    showing=true;
    const e=queue.shift();
    card.textContent=`${safe(e.icon||'✨')} ${safe(e.message||'마을에 새로운 소식이 있어요!')}`;
    card.hidden=false;
    requestAnimationFrame(()=>{card.style.opacity='1';card.style.transform='translateY(0)'});
    setTimeout(()=>{
      card.style.opacity='0';card.style.transform='translateY(-12px)';
      setTimeout(()=>{card.hidden=true;showing=false;next()},240);
    },Math.max(1800,Math.min(6000,Number(e.duration)||3600)));
  }
  function show(event={}){queue.push({icon:event.icon||'✨',message:event.message||'',duration:event.duration||3600,type:event.type||'celebration'});next()}
  window.addEventListener('studyvillage:live-event',e=>show(e.detail||{}));
  window.StudyVillageLiveEvents={show,lane:'top-announcement'};
})();