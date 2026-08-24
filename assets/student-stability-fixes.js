/* Student tablet stability fixes: direct challenge launch, guide interaction, recoverable results, immediate records, and detailed ranking tabs. */
(()=>{
  const game=document.querySelector('#game-screen');if(!game)return;

  document.addEventListener('click',event=>{
    const button=event.target.closest?.('#record-button');if(!button)return;
    const panel=document.querySelector('#record-panel');if(panel)panel.hidden=false;
  },true);
  window.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const panel=document.querySelector('#record-panel');if(panel&&!panel.hidden)panel.hidden=true},true);

  /* Guide teacher must react to a direct tablet tap/click as well as Space proximity interaction. */
  document.addEventListener('click',event=>{
    const guide=event.target.closest?.('#guide-npc');if(!guide)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(typeof window.openDialogue==='function'){window.openDialogue();return}
    const talk=document.querySelector('#talk-button');if(talk)talk.click();
  },true);

  /* Challenge hall must call the real quiz function directly. Fake Space caused the player to fall
     back to the village or talk to the guide teacher depending on camera/proximity timing. */
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('#interior-action-wrap .interior-primary');
    if(!button||!button.textContent?.includes('수수께끼 도전 시작'))return;
    event.preventDefault();event.stopImmediatePropagation();
    const interior=document.querySelector('#building-interior');if(interior)interior.hidden=true;
    document.body.classList.remove('inside-building');
    if(typeof window.openQuiz==='function'){window.openQuiz();return}
    const quizHall=document.querySelector('#quiz-hall'),player=document.querySelector('#player');
    if(quizHall&&player){const old=player.style.left;player.style.left=quizHall.style.left||player.style.left;setTimeout(()=>{window.dispatchEvent(new KeyboardEvent('keydown',{key:' ',code:'Space',bubbles:true,cancelable:true}));player.style.left=old},0)}
  },true);

  /* A failed legacy challenge save must never trap the student until refresh. Add an explicit exit
     while preserving the checkpoint so the result can be retried later. */
  const quiz=document.querySelector('#quiz-panel'),quizOptions=document.querySelector('#quiz-options'),quizNext=document.querySelector('#quiz-next'),quizQuestion=document.querySelector('#quiz-question');
  function addRecoveryExit(){
    if(!quiz||quiz.hidden||!quizQuestion?.textContent?.includes('교실 서버 연결을 기다리고 있어요.'))return;
    if(quiz.querySelector('[data-save-recovery-exit]'))return;
    const exit=document.createElement('button');exit.type='button';exit.dataset.saveRecoveryExit='1';exit.className='quiz-next';exit.textContent='마을로 돌아가기 🏡';exit.style.marginLeft='8px';
    exit.onclick=()=>{const close=document.querySelector('#quiz-close');if(close)close.click();else{quiz.hidden=true;document.body.classList.remove('inside-building')}};
    (quizNext?.parentElement||quiz).appendChild(exit);
  }
  if(quiz)new MutationObserver(addRecoveryExit).observe(quiz,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden']});

  const ranking=document.querySelector('#student-ranking-panel'),rankingButton=document.querySelector('.sv-quick-button.ranking');
  if(!ranking||!rankingButton)return;
  const card=ranking.querySelector('.sv-hub-card'),list=ranking.querySelector('#student-ranking-list');if(!card||!list)return;
  let tabs=ranking.querySelector('.sv-ranking-tabs');if(!tabs){tabs=document.createElement('div');tabs.className='sv-ranking-tabs';ranking.querySelector('.sv-hub-head')?.after(tabs)}
  const modes=[['level','레벨'],['totalScore','누적 점수'],['bestScore','최고 점수'],['attempts','도전 횟수']];let mode='level',requestId=0;
  tabs.innerHTML='';for(const[key,label]of modes){const b=document.createElement('button');b.type='button';b.dataset.rankMode=key;b.textContent=label;b.className=key===mode?'selected':'';tabs.appendChild(b)}
  if(!document.querySelector('#sv-ranking-tab-style')){const style=document.createElement('style');style.id='sv-ranking-tab-style';style.textContent=`.sv-ranking-tabs{display:flex;gap:7px;flex-wrap:wrap;margin:14px 0 4px}.sv-ranking-tabs button{border:0;border-radius:999px;padding:8px 11px;background:#edf3e9;color:#56705c;font-weight:900;cursor:pointer}.sv-ranking-tabs button.selected{background:#4f8c5b;color:white}.sv-rank-metric{justify-self:end;font-weight:1000;color:#6b5520;background:#fff1bd;border-radius:999px;padding:5px 8px;white-space:nowrap}.sv-rank-row{grid-template-columns:42px 72px minmax(0,1fr) auto!important}@media(max-width:700px){.sv-rank-row{grid-template-columns:38px 58px minmax(0,1fr)!important}.sv-rank-metric{grid-column:3;justify-self:start}}`;document.head.appendChild(style)}
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const metricValue=p=>mode==='level'?(Number(p.level)||1):mode==='totalScore'?(Number(p.totalScore)||0):mode==='bestScore'?(Number(p.bestScore)||0):(Number(p.attempts)||0);
  const metricLabel=p=>mode==='level'?`Lv.${Number(p.level)||1}`:mode==='attempts'?`${Number(p.attempts)||0}회`:`${metricValue(p)}점`;
  const sortPlayers=players=>players.sort((a,b)=>metricValue(b)-metricValue(a)||(Number(b.xp)||0)-(Number(a.xp)||0)||String(a.name||'').localeCompare(String(b.name||''),'ko'));
  async function refresh(){if(ranking.hidden)return;const id=++requestId,me=document.querySelector('#profile-name')?.textContent?.trim();list.innerHTML='<p class="activity-summary-empty">랭킹을 불러오는 중이에요.</p>';try{const players=sortPlayers(await window.StudyVillageData.listPlayers());if(id!==requestId||ranking.hidden)return;list.innerHTML='';if(!players.length){list.innerHTML='<p class="activity-summary-empty">아직 랭킹 기록이 없어요.</p>';return}players.slice(0,30).forEach((p,i)=>{const row=document.createElement('article'),equipment=p.equipment&&typeof p.equipment==='object'?p.equipment:{},title=String(p.title||'새싹 주민');row.className=`sv-rank-row${p.name===me?' me':''}`;row.innerHTML=`<span class="sv-rank-number">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><span class="sv-rank-avatar"><span class="sv-rank-hat"></span><span class="sv-rank-glasses"></span><span class="sv-rank-base"></span><span class="sv-rank-bag"></span><span class="sv-rank-pet"></span></span><span class="sv-rank-name"><b class="sv-rank-level">Lv.${Number(p.level)||1}</b><span class="sv-rank-title" title="${esc(title)}">🏷️ ${esc(title)}</span><strong>${esc(p.name)}${p.name===me?' · 나':''}</strong></span><span class="sv-rank-metric">${metricLabel(p)}</span>`;list.appendChild(row);const r=window.StudyVillageAvatar;r?.paintBase(row.querySelector('.sv-rank-base'),p.baseCharacter||'student-default');r?.paintItem(row.querySelector('.sv-rank-hat'),equipment.hat);r?.paintItem(row.querySelector('.sv-rank-glasses'),equipment.glasses);r?.paintItem(row.querySelector('.sv-rank-bag'),equipment.bag);r?.paintItem(row.querySelector('.sv-rank-pet'),equipment.pet)})}catch{if(id===requestId)list.innerHTML='<p class="activity-summary-empty">랭킹을 불러오지 못했어요. 잠시 후 다시 눌러 주세요.</p>'}}
  tabs.onclick=event=>{const b=event.target.closest('button[data-rank-mode]');if(!b)return;mode=b.dataset.rankMode;tabs.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));refresh()};
  rankingButton.addEventListener('click',()=>setTimeout(refresh,0));window.addEventListener('studyvillage:ranking-refresh',()=>setTimeout(refresh,0));
})();
