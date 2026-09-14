/* Shared choice/input question response rules. */
(()=>{
  const normalize=value=>String(value??'').trim().replace(/\s+/g,' ').toLocaleLowerCase('ko-KR');
  const typeOf=question=>question?.type==='input'?'input':'choice';
  const visibleLength=value=>[...String(value??'').replace(/\s/g,'')].length;
  const shuffle=values=>{const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
  function hasLongestCorrect(question){if(typeOf(question)!=='choice'||!Array.isArray(question?.options)||question.options.length<2)return false;const answer=Number(question.answer);if(!Number.isInteger(answer)||answer<0||answer>=question.options.length)return false;const correct=visibleLength(question.options[answer]),wrong=Math.max(...question.options.filter((_,index)=>index!==answer).map(visibleLength));return correct>wrong}
  function balancedSample(values,count){const wanted=Math.max(0,Math.min(Number(count)||0,values.length)),mixed=shuffle(values),biased=mixed.filter(hasLongestCorrect),regular=mixed.filter(question=>!hasLongestCorrect(question));let biasedCount=0;if(biased.length){const minimum=Math.max(0,wanted-regular.length);biasedCount=Math.max(minimum,regular.length>=wanted?(Math.random()<.5?1:0):1);biasedCount=Math.min(biasedCount,biased.length,wanted)}return shuffle([...biased.slice(0,biasedCount),...regular.slice(0,wanted-biasedCount),...biased.slice(biasedCount,biasedCount+Math.max(0,wanted-biasedCount-regular.length))]).slice(0,wanted)}
  function correct(question,response){if(typeOf(question)==='input'){const value=normalize(response);return !!value&&(question.acceptedAnswers||[]).some(answer=>normalize(answer)===value)}return Number(response)===Number(question?.answer)}
  window.StudyVillageQuestionResponse={normalize,typeOf,correct,hasLongestCorrect,balancedSample};
  // Start supplemental banks as soon as the stable base banks exist. Activity openers rebuild
  // their pools on entry, while one shared readiness promise prevents partial catalog snapshots.
  window.StudyVillageCurriculumSupplementReady=Promise.all([
    import('./assets/curriculum-content-supplement.js?v=20260913choicebalance1'),
    import('./assets/bookmaru-variety-supplement.js?v=20260913choicebalance1'),
    import('./assets/math-curriculum-supplement.js?v=20260828v1'),
    import('./assets/social-science-curriculum-supplement.js?v=20260828v1')
  ]).catch(err=>{console.warn('[Studyvillage] curriculum supplement unavailable',err);return null});
})();
