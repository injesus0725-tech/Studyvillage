'use strict';
const assert=require('assert');
const fs=require('fs');
const read=file=>fs.readFileSync(file,'utf8');

const routes={
  'legacy village quiz':read('game.js'),
  'Bookmaru':read('library-game.js'),
  'curriculum learning':read('assets/student-curriculum-learning.js'),
  'challenge hall':read('assets/student-challenge-hall.js'),
  'exploration':read('assets/student-exploration-v2.js')
};
assert.ok(routes['legacy village quiz'].includes('options:order.map(id=>source.options[id])')&&routes['legacy village quiz'].includes('answer:order.indexOf(source.answer)'),'legacy quiz must shuffle options and move the answer index');
for(const [name,source] of Object.entries(routes).filter(([name])=>name!=='legacy village quiz')){
  assert.ok(source.includes('options=shuffle(')&&source.includes('answer:options.indexOf('),`${name} must shuffle options and move the answer index`);
}
assert.ok(routes.Bookmaru.includes('${Number(item.answer)+1}번'), 'Bookmaru feedback must show the shuffled answer number');
for(const name of ['curriculum learning','challenge hall','exploration'])assert.ok(routes[name].includes('${Number(q.answer)+1}번'),`${name} feedback must show the shuffled answer number`);
const server=read('server/math-practice.js');
assert.ok(server.includes('.map(randomizeChoiceProblem)')&&server.includes('answer:options.indexOf(correct)'),'server-scored random math must shuffle before saving and issuing the session');
assert.ok(server.includes('answerNumber:Number(problem.answer)+1'),'server-scored random math must return the shuffled answer number for result display');
assert.ok(routes.exploration.includes('${r.answerNumber}번')&&read('math-practice.js').includes('${row.answerNumber}번 · '),'math choice feedback and review must display the server-owned shuffled answer number');
const admin=read('admin-question-editor.js');
assert.ok(admin.includes('정답 ${Number(q.answer)+1}번'),'teacher editing must retain a stable source answer number');
console.log('student choice randomization contract self-test passed');
