/* Village math-playground review helper. The village hall keeps its original random-addition mode; exploration sends its own explicit mode. */
(()=>{
  if(window.StudyVillageMathReview)return;
  let latest=[];const originalFetch=window.fetch.bind(window);
  window.fetch=async(input,options={})=>{const url=String(input||'');let nextOptions=options;if(url==='/api/player/me/math-practice/start'&&String(options?.method||'GET').toUpperCase()==='POST'&&!options?.body){nextOptions={...options,headers:{'Content-Type':'application/json',...(options.headers||{})},body:JSON.stringify({mode:'addition'})}}const response=await originalFetch(input,nextOptions);if(/\/math-practice\/[^/]+\/answers(?:\?|$)/.test(url)&&document.querySelector('.math-practice-panel:not([hidden])')){try{const data=await response.clone().json();if(data.ok&&Array.isArray(data.review))latest=data.review}catch{}}return response};
  function render(){const panel=document.querySelector('.math-practice-panel:not([hidden])'),feedback=panel?.querySelector('.library-feedback.success');if(!panel||!feedback||!latest.length||panel.querySelector('.math-result-review'))return;const box=document.createElement('section');box.className='math-result-review';const wrong=latest.filter(row=>!row.correct);box.innerHTML=`<h3>${wrong.length?'틀린 문제 다시 보기':'모두 맞았어요! 🌟'}</h3>${wrong.map(row=>`<article><strong>${row.number}번 · ${row.prompt}</strong><p>내 답: ${row.studentAnswer} · 정답: ${row.answer}</p><small>${row.explanation}</small></article>`).join('')}`;feedback.after(box)}
  new MutationObserver(render).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','hidden']});
  window.StudyVillageMathReview={render};
})();
