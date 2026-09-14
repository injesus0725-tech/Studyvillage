'use strict';
const assert=require('assert');
const fs=require('fs');
const vm=require('vm');

const response=fs.readFileSync('question-response.js','utf8');
const executable=response.slice(0,response.indexOf('  // Start supplemental banks'))+'})();';
const sandbox={window:{},Math};
vm.runInNewContext(executable,sandbox,{filename:'question-response.js'});
const rules=sandbox.window.StudyVillageQuestionResponse;
assert.strictEqual(typeof rules.balancedSample,'function','shared balanced sampler must be exposed');

const biased=Array.from({length:20},(_,index)=>({id:`b${index}`,type:'choice',options:['정답만 더 길어요','오답','틀림'],answer:0}));
const regular=Array.from({length:20},(_,index)=>({id:`r${index}`,type:'choice',options:['정답','오답도 길어요','틀림'],answer:0}));
for(let round=0;round<200;round++){
  const picked=rules.balancedSample([...biased,...regular],7);
  assert.strictEqual(picked.length,7,'balanced sampler must keep the requested round size');
  assert.ok(picked.filter(rules.hasLongestCorrect).length<=1,'a round must not reveal answers through repeated longest-choice bias');
}

for(const file of ['library-game.js','assets/student-challenge-hall.js','assets/student-exploration-subject-pools.js','assets/student-exploration-v2.js']){
  assert.ok(fs.readFileSync(file,'utf8').includes('balancedSample'),`${file} must use the shared balanced sampler`);
}

const context=vm.createContext({window:{}});
for(const file of ['question-data.js','curriculum-question-bank.js','assets/curriculum-content-expansion.js','assets/curriculum-content-supplement.js','assets/bookmaru-variety-supplement.js','assets/math-curriculum-supplement.js','assets/social-science-curriculum-supplement.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
}
const length=value=>[...String(value||'').replace(/\s/g,'')].length;
const severe=[];
for(const [setId,set] of Object.entries(context.window.StudyVillageQuestionSets||{}))for(const question of set.questions||[]){
  if(question.type==='input'||!Array.isArray(question.options)||question.options.length<2)continue;
  const correct=length(question.options[question.answer]);
  const wrong=Math.max(...question.options.filter((_,index)=>index!==question.answer).map(length));
  if(correct-wrong>=10)severe.push(`${setId}:${question.id}`);
}
assert.deepStrictEqual(severe,[],'fixed bank must not contain conspicuously longer correct choices');
console.log('question choice length balance contract self-test passed');
