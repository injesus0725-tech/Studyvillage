/* Student tablet stability fixes: guide interaction, immediate records, ranking tabs, and retired legacy riddle guard. */
(()=>{
  const game=document.querySelector('#game-screen');if(!game)return;

  /* The old standalone riddle challenge is retired. Keep the legacy nodes inert because game.js still
     owns references to them, but move the hall permanently out of interaction range and keep its panel closed. */
  const legacyQuizHall=document.querySelector('#quiz-hall'),legacyQuizPanel=document.querySelector('#quiz-panel');
  if(legacyQuizHall){legacyQuizHall.setAttribute('aria-hidden','true');legacyQuizHall.style.setProperty('position','fixed','important');legacyQuizHall.style.setProperty('left','-10000px','important');legacyQuizHall.style.setProperty('top','-10000px','important');legacyQuizHall.style.setProperty('visibility','hidden','important');legacyQuizHall.style.setProperty('pointer-events','none','important')}
  if(legacyQuizPanel){legacyQuizPanel.hidden=true;legacyQuizPanel.setAttribute('aria-hidden','true')}

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
  async function refresh(){if(ranking.hidden)return;const id=++requestId,me=document.querySelector('#profile-name')?.textContent?.trim();list.innerHTML='<p class="activity-summary-empty">랭킹을 불러오는 중이에요.</p>';try{const players=sortPlayers(await window.StudyVillageData.listPlayers());if(id!==requestId||ranking.hidden)return;list.innerHTML='';if(!players.length){list.innerHTML='<p class="activity-summary-empty">아직 랭킹 기록이 없어요.</p>';return}players.slice(0,30).forEach((p,i)=>{const row=document.createElement('article'),equipment=p.equipment&&typeof p.equipment==='object'?p.equipment:{},title=String(p.title||'새싹 주민');row.className=`sv-rank-row${p.name===me?' me':''}`;row.innerHTML=`<span class="sv-rank-number">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><span class="sv-rank-avatar"><span class="sv-rank-hair"></span><span class="sv-rank-outfit"></span><span class="sv-rank-bottom"></span><span class="sv-rank-shoes"></span><span class="sv-rank-base"></span><span class="sv-rank-hat"></span><span class="sv-rank-glasses"></span><span class="sv-rank-bag"></span><span class="sv-rank-hand"></span><span class="sv-rank-pet"></span></span><span class="sv-rank-name"><b class="sv-rank-level">Lv.${Number(p.level)||1}</b><span class="sv-rank-title" title="${esc(title)}">🏷️ ${esc(title)}</span><strong>${esc(p.name)}${p.name===me?' · 나':''}</strong></span><span class="sv-rank-metric">${metricLabel(p)}</span>`;list.appendChild(row);const r=window.StudyVillageAvatar,baseId=p.baseCharacter||'student-default';r?.paintAvatarBase(row.querySelector('.sv-rank-base'),baseId);r?.paintHair(row.querySelector('.sv-rank-hair'),equipment.hair,baseId);for(const slot of ['outfit','bottom','shoes','hat','glasses','bag','hand','pet'])r?.paintItem(row.querySelector(`.sv-rank-${slot}`),equipment[slot])})}catch{if(id===requestId)list.innerHTML='<p class="activity-summary-empty">랭킹을 불러오지 못했어요. 잠시 후 다시 눌러 주세요.</p>'}}
  tabs.onclick=event=>{const b=event.target.closest('button[data-rank-mode]');if(!b)return;mode=b.dataset.rankMode;tabs.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));refresh()};
  rankingButton.addEventListener('click',()=>setTimeout(refresh,0));window.addEventListener('studyvillage:ranking-refresh',()=>setTimeout(refresh,0));
})();
