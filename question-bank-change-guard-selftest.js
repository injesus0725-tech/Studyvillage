'use strict';
const assert=require('assert');
const {validateBanks}=require('./scripts/question-bank-change-guard');

const q=(id,question)=>({id,question,options:['정답','오답1','오답2','오답3'],answer:0,explanation:'해설'});
const before={unit:{activityId:'unit',subject:'국어',questions:[q('u-001','기존 문제')]}};
const after=JSON.parse(JSON.stringify(before));
after.unit.questions.push(q('u-002','새 문제'));
assert.strictEqual(validateBanks(before,after),1);

for(const mutate of [
  bank=>{bank.unit.questions[0].question='기존 문제 변경'},
  bank=>{bank.unit.questions=[]},
  bank=>{bank.unit.subject='수학'},
  bank=>{bank.other={activityId:'other',questions:[q('o-001','새 단원')]}},
  bank=>{bank.unit.questions.push(q('u-001','중복 아이디'))},
  bank=>{bank.unit.questions.push(q('u-002','기존 문제'))}
]){
  const bad=JSON.parse(JSON.stringify(after));
  mutate(bad);
  assert.throws(()=>validateBanks(before,bad));
}
console.log('question bank change guard self-test passed');
