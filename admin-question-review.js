/* v1.9 teacher question review panel. Read-only against question source; review state is teacher-browser local. */
(()=>{
  const STORE='studyvillage-question-review-state-v1';
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const readState=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{return{}}};
  const writeState=s=>localStorage.setItem(STORE,JSON.stringify(s));
  let loading=false,panel,list,count,summary;
  function ensurePanel(){
    if(panel)return;
    const app=document.querySelector('#admin-app');if(!app)return;
    panel=document.createElement('section');panel.id='question-review-panel';panel.className='panel';panel.innerHTML=`<div class="panel-head"><div><h2>🧩 문제 확인 필요</h2><p>문제 데이터의 형식 이상만 검사합니다. 문제·보기·정답은 자동으로 수정하지 않습니다.</p></div><span id="question-review-count" class="overview-count">0건</span></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"><button id="question-review-scan">문제 다시 검사</button><span id="question-review-summary" class="status">검사 전</span></div><div id="question-review-list"><p class="empty">문제 데이터를 검사하는 중입니다.</p></div>`;
    const anchor=document.querySelector('#score-alert-panel');anchor?.after(panel);if(!anchor)app.prepend(panel);
    list=panel.querySelector('#question-review-list');count=panel.querySelector('#question-review-count');summary=panel.querySelector('#question-review-summary');panel.querySelector('#question-review-scan').addEventListener('click',scan);
    list.addEventListener('click',e=>{const b=e.target.closest('button[data-review-key]');if(!b)return;const key=b.dataset.reviewKey,status=b.dataset.status,state=readState();state[key]={status,note:state[key]?.note||'',reviewedAt:new Date().toISOString()};writeState(state);render(window.__studyvillageQuestionIssues||[])});
  }
  function extractQuestions(source){
    const m=source.match(/const questions\s*=\s*(\[[\s\S]*?\]);\s*\n\s*let index=/);if(!m)throw new Error('문제 배열을 찾지 못했습니다.');
    return Function(`"use strict";return (${m[1]});`)();
  }
  async function scan(){
    if(loading)return;loading=true;ensurePanel();summary.textContent='검사 중…';
    try{
      const [{auditQuestionSet},source]=await Promise.all([import('/server/question-audit.js'),fetch('/library-game.js',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('문제 파일을 읽지 못했습니다.');return r.text()})]);
      const questions=extractQuestions(source),audit=auditQuestionSet({activityId:'vocabulary',subject:'국어',topic:'어휘',questions});
      window.__studyvillageQuestionIssues=(audit.issues||[]).map(issue=>({...issue,activityId:audit.activityId,subject:audit.subject,topic:audit.topic}));
      summary.textContent=`${audit.questionCount}문제 · 이상 ${audit.issueCount}건`;render(window.__studyvillageQuestionIssues);
    }catch(err){list.innerHTML=`<p class="empty">문제 검사 실패: ${esc(err?.message||err)}</p>`;summary.textContent='검사 실패';count.textContent='-'}finally{loading=false}
  }
  function render(issues){
    ensurePanel();const state=readState(),rows=issues.map(issue=>{const key=`${issue.activityId}:${issue.question||0}:${issue.code}`,review=state[key]||{};return{...issue,key,review}}),pending=rows.filter(r=>r.review.status!=='confirmed'&&r.review.status!=='dismissed');count.textContent=`${pending.length}건`;panel.hidden=false;list.innerHTML='';
    if(!rows.length){list.innerHTML='<div class="attention-clear">✅ 현재 자동 검사에서 확인 필요한 문제 형식이 발견되지 않았습니다.</div>';return}
    rows.forEach(r=>{const article=document.createElement('article');article.className='attention-card';const done=r.review.status==='confirmed'?'확인 완료':r.review.status==='dismissed'?'문제 없음':'확인 필요';article.innerHTML=`<div class="attention-card-head"><strong>${r.severity==='error'?'🔴':'🟡'} ${esc(r.activityId)} · ${r.question?`${r.question}번`:'전체'}</strong><span>${done}</span></div><p>${esc(r.message)}</p><small>${esc(r.subject)}${r.topic?` · ${esc(r.topic)}`:''} · ${esc(r.code)}</small><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button data-review-key="${esc(r.key)}" data-status="confirmed">확인 완료</button><button data-review-key="${esc(r.key)}" data-status="dismissed">문제 없음</button><button data-review-key="${esc(r.key)}" data-status="pending">다시 확인</button></div>`;list.appendChild(article)})
  }
  function maybeScan(){ensurePanel();const app=document.querySelector('#admin-app');if(app&&!app.hidden)scan()}
  window.addEventListener('load',()=>{ensurePanel();setTimeout(maybeScan,300)});
  document.querySelector('#refresh-button')?.addEventListener('click',()=>setTimeout(maybeScan,250));
  new MutationObserver(()=>maybeScan()).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['hidden']});
})();
