const fs=require('fs'),vm=require('vm'),assert=require('assert');
for(const page of ['index.html','admin.html'])assert.ok(fs.readFileSync(page,'utf8').includes('assets/curriculum-content-expansion.js?v=20260828v1'),`${page} must load the same expanded question pack`);
const context={window:{}};vm.createContext(context);
for(const file of ['question-data.js','curriculum-question-bank.js','assets/curriculum-content-expansion.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const sets=Object.values(context.window.StudyVillageQuestionSets||{});
const korean=sets.filter(set=>set.subject==='국어'&&/^\d단원|^매체/.test(set.unit||''));
assert.equal(korean.length,14,'all fourteen Korean semester units must remain registered');
for(const set of korean)assert.ok(set.questions.length>=8,`${set.activityId} needs at least eight randomizable questions`);
const arts=sets.filter(set=>set.subject==='예체능');
assert.ok(arts.reduce((sum,set)=>sum+set.questions.length,0)>=55,'arts/PE/safety/health pool needs at least 55 questions');
for(const set of [...korean,...arts]){
 const ids=new Set(),prompts=new Set();
 for(const q of set.questions){
  assert.ok(!ids.has(q.id),`${set.activityId} duplicate id ${q.id}`);ids.add(q.id);
  assert.ok(!prompts.has(q.question),`${set.activityId} duplicate prompt`);prompts.add(q.question);
  assert.ok(q.options.length===4&&new Set(q.options).size===4,`${q.id} options must be four unique choices`);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,`${q.id} answer index invalid`);
  assert.ok(q.options[q.answer]&&q.explanation,`${q.id} needs a reachable answer and explanation`);
 }
}
console.log('curriculum content expansion contract self-test passed');
