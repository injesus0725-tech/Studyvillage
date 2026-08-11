/* v1.9 Bookmaru vocabulary mini game + safe teacher override fallback */
(()=>{
  const game=document.querySelector('#game-screen');
  if(!game)return;
  const ACTIVITY_ID='vocabulary',SAVE_TIMEOUT_MS=5000;
  const questionSet=window.StudyVillageQuestionSets?.vocabulary;
  const baseQuestions=Array.isArray(questionSet?.questions)?questionSet.questions:[];
  if(!baseQuestions.length){console.error('[Studyvillage] vocabulary question data missing');return}
  let questions=baseQuestions.map(q=>({...q,options:[...q.options]}));
  let index=0,score=0,answered=false,saving=false;
  const panel=document.createElement('div');panel.id='library-game';panel.hidden=true;panel.innerHTML=`<div class="library-card"><button id="library-close" class="quiz-close">✕</button><span class="library-badge">📚 책마루</span><h2>낱말 뜻 맞추기</h2><div class="library-status"><span id="library-progress">1 / 5</span><strong id="library-score">0점</strong></div><div class="library-word" id="library-word"></div><p class="library-guide">이 낱말의 뜻으로 알맞은 것을 골라 보세요.</p><div id="library-options" class="library-options"></div><p id="library-feedback" class="library-feedback"></p><button id="library-next" class="interior-primary" hidden>다음 문제 ▶</button></div>`;game.appendChild(panel);
  const q=s=>panel.querySelector(s),close=q('#library-close'),progress=q('#library-progress'),scoreEl=q('#library-score'),word=q('#library-word'),options=q('#library-options'),feedback=q('#library-feedback'),next=q('#library-next');
  const headers=()=>window.StudyVillageAuth?.authHeaders?.()||{};
  const playerName=()=>document.querySelector('#profile-name')?.textContent?.trim()||'';
  const checkpoint=()=>window.StudyVillageCheckpoint;
  const validQuestion=item=>!!item&&typeof item.word==='string'&&item.word.trim().length>0&&Array.isArray(item.options)&&item.options.length>=2&&item.options.every(v=>typeof v==='string'&&v.trim().length>0)&&Number.isInteger(Number(item.answer))&&Number(item.answer)>=0&&Number(item.answer)<item.options.length;
  async function loadQuestions(){questions=baseQuestions.map(q=>({...q,options:[...q.options]}));try{const r=await fetch('/api/question-overrides',{cache:'no-store'});if(!r.ok)throw new Error('override-load-failed');const d=await r.json(),overrides=d?.overrides||{};let applied=0;questions=questions.map((base,i)=>{const row=overrides[`${ACTIVITY_ID}:${i+1}`]?.question;if(!row)return base;if(!validQuestion(row)){console.warn(`[Studyvillage] invalid question override ignored: ${ACTIVITY_ID}:${i+1}`);return base}applied++;return{...base,...row,options:[...row.options],answer:Number(row.answer)}});if(applied)console.info(`[Studyvillage] applied ${applied} teacher question override(s)`)}catch(err){console.warn('[Studyvillage] question override unavailable; using bundled questions',err?.message||err)}}
  function saveCheckpoint(){const name=playerName();if(!name||!checkpoint())return;checkpoint().save(name,ACTIVITY_ID,{index,score,total:questions.length})}
  function clearCheckpoint(){const name=playerName();if(name&&checkpoint())checkpoint().clear(name,ACTIVITY_ID)}
  function readCheckpoint(){const name=playerName(),saved=name&&checkpoint()?checkpoint().load(name,ACTIVITY_ID):null,p=saved?.progress;if(!p)return null;const savedIndex=Number(p.index),savedScore=Number(p.score);if(!Number.isInteger(savedIndex)||savedIndex<0||savedIndex>=questions.length||!Number.isFinite(savedScore)||savedScore<0||savedScore>100)return null;return{index:savedIndex,score:savedScore,updatedAt:saved.updatedAt}}
  async function open(){index=0;score=0;answered=false;saving=false;await loadQuestions();const saved=readCheckpoint();if(saved&&confirm(`이전에 풀던 책마루 기록이 있어요. ${saved.index+1}번 문제부터 이어서 할까요?`)){index=saved.index;score=saved.score}else if(saved)clearCheckpoint();panel.hidden=false;render()}
  function render(){const item=questions[index];answered=false;saveCheckpoint();progress.textContent=`${index+1} / ${questions.length}`;scoreEl.textContent=`${score}점`;word.textContent=item.word;feedback.textContent='';feedback.className='library-feedback';next.hidden=true;next.onclick=null;options.innerHTML='';item.options.forEach((text,i)=>{const b=document.createElement('button');b.className='library-option';b.textContent=`${i+1}. ${text}`;b.onclick=()=>answer(i);options.appendChild(b)})}
  function answer(i){if(answered)return;answered=true;const item=questions[index],buttons=[...options.querySelectorAll('button')];buttons.forEach((b,j)=>{b.disabled=true;if(j===item.answer)b.classList.add('correct');if(j===i&&j!==item.answer)b.classList.add('wrong')});if(i===item.answer){score+=20;feedback.textContent='정답이에요! 🌟';feedback.classList.add('success')}else{feedback.textContent=`아쉬워요. 정답은 “${item.options[item.answer]}”예요.`;feedback.classList.add('error')}scoreEl.textContent=`${score}점`;next.hidden=false;next.textContent=index===questions.length-1?'결과 보기 📖':'다음 문제 ▶'}
  async function saveActivity(){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),SAVE_TIMEOUT_MS);try{const r=await fetch('/api/player/me/activity',{method:'POST',headers:{'Content-Type':'application/json',...headers()},body:JSON.stringify({activityId:ACTIVITY_ID,score}),signal:controller.signal});if(!r.ok)throw new Error('save-failed');return r.json()}finally{clearTimeout(timeout)}}
  async function finish(){
    if(saving)return;saving=true;progress.textContent='완료';word.textContent=score===100?'어휘 박사! 🏆':'책마루 도전 완료!';options.innerHTML='';feedback.textContent='기록 저장 중...';feedback.className='library-feedback';next.hidden=true;
    try{
      const result=await saveActivity();clearCheckpoint();const record=result.record||{},xp=result.gainedXp||0;feedback.textContent=`${questions.length}문제 중 ${score/20}문제 정답 · ${score}점 · +${xp} XP\n어휘 도전 ${record.attempts||1}회 · 최고 ${record.bestScore??score}점`;feedback.className='library-feedback success';window.dispatchEvent(new CustomEvent('studyvillage:library-complete',{detail:{score,correct:score/20,total:questions.length,gainedXp:xp,record,player:result.player}}));next.hidden=false;next.textContent='책마루로 돌아가기';next.onclick=()=>{panel.hidden=true;next.onclick=null}
    }catch{
      saveCheckpoint();progress.textContent='저장 대기';word.textContent='교실 서버 연결을 기다리고 있어요.';feedback.textContent=`이번 ${score}점은 이 기기에 임시 보관했어요. 서버가 돌아온 뒤 다시 저장해 주세요.`;feedback.className='library-feedback error';next.hidden=false;next.textContent='결과 다시 저장하기 ↻';next.onclick=finish
    }finally{saving=false}
  }
  next.addEventListener('click',()=>{if(index===questions.length-1)return finish();index++;render()});close.addEventListener('click',()=>{if(!saving)panel.hidden=true});window.addEventListener('studyvillage:open-library-game',open);
})();
