/* v0.8.3 Bookmaru vocabulary mini game */
(()=>{
  const game=document.querySelector('#game-screen');
  if(!game)return;
  const questions=[
    {word:'다정하다',options:['정이 많고 친절하다','매우 빠르다','소리가 크다','마음이 급하다'],answer:0},
    {word:'망설이다',options:['바로 행동하다','결정하지 못하고 주저하다','기뻐서 웃다','조용히 기다리다'],answer:1},
    {word:'뿌듯하다',options:['속이 상하다','몹시 피곤하다','보람을 느껴 기쁘다','깜짝 놀라다'],answer:2},
    {word:'살피다',options:['주의 깊게 자세히 보다','큰 소리로 부르다','빨리 달리다','잠깐 쉬다'],answer:0},
    {word:'격려하다',options:['잘못을 꾸짖다','힘내도록 용기와 힘을 북돋우다','모르는 척하다','혼자 해결하다'],answer:1}
  ];
  let index=0,score=0,answered=false;
  const panel=document.createElement('div');panel.id='library-game';panel.hidden=true;panel.innerHTML=`<div class="library-card"><button id="library-close" class="quiz-close">✕</button><span class="library-badge">📚 책마루</span><h2>낱말 뜻 맞추기</h2><div class="library-status"><span id="library-progress">1 / 5</span><strong id="library-score">0점</strong></div><div class="library-word" id="library-word"></div><p class="library-guide">이 낱말의 뜻으로 알맞은 것을 골라 보세요.</p><div id="library-options" class="library-options"></div><p id="library-feedback" class="library-feedback"></p><button id="library-next" class="interior-primary" hidden>다음 문제 ▶</button></div>`;game.appendChild(panel);
  const q=s=>panel.querySelector(s),close=q('#library-close'),progress=q('#library-progress'),scoreEl=q('#library-score'),word=q('#library-word'),options=q('#library-options'),feedback=q('#library-feedback'),next=q('#library-next');
  function open(){index=0;score=0;answered=false;panel.hidden=false;render()}
  function render(){const item=questions[index];answered=false;progress.textContent=`${index+1} / ${questions.length}`;scoreEl.textContent=`${score}점`;word.textContent=item.word;feedback.textContent='';feedback.className='library-feedback';next.hidden=true;options.innerHTML='';item.options.forEach((text,i)=>{const b=document.createElement('button');b.className='library-option';b.textContent=`${i+1}. ${text}`;b.onclick=()=>answer(i,b);options.appendChild(b)})}
  function answer(i){if(answered)return;answered=true;const item=questions[index],buttons=[...options.querySelectorAll('button')];buttons.forEach((b,j)=>{b.disabled=true;if(j===item.answer)b.classList.add('correct');if(j===i&&j!==item.answer)b.classList.add('wrong')});if(i===item.answer){score+=20;feedback.textContent='정답이에요! 🌟';feedback.classList.add('success')}else{feedback.textContent=`아쉬워요. 정답은 “${item.options[item.answer]}”예요.`;feedback.classList.add('error')}scoreEl.textContent=`${score}점`;next.hidden=false;next.textContent=index===questions.length-1?'결과 보기 📖':'다음 문제 ▶'}
  function finish(){progress.textContent='완료';word.textContent=score===100?'어휘 박사! 🏆':'책마루 도전 완료!';options.innerHTML='';feedback.textContent=`5문제 중 ${score/20}문제를 맞혔어요. 총 ${score}점!`;feedback.className='library-feedback success';next.hidden=false;next.textContent='책마루로 돌아가기';next.onclick=()=>{panel.hidden=true;next.onclick=null};window.dispatchEvent(new CustomEvent('studyvillage:library-complete',{detail:{score,correct:score/20,total:5}}))}
  next.addEventListener('click',()=>{if(index===questions.length-1)return finish();index++;render()});close.addEventListener('click',()=>panel.hidden=true);window.addEventListener('studyvillage:open-library-game',open);
})();
