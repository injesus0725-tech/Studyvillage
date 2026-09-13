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
const server=read('server/math-practice.js');
assert.ok(server.includes('.map(randomizeChoiceProblem)')&&server.includes('answer:options.indexOf(correct)'),'server-scored random math must shuffle before saving and issuing the session');
const admin=read('admin-question-editor.js');
assert.ok(admin.includes('정답 ${Number(q.answer)+1}번'),'teacher editing must retain a stable source answer number');
console.log('student choice randomization contract self-test passed');
