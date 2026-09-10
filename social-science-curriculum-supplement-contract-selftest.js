const fs=require('fs'),vm=require('vm'),assert=require('assert');
const student=fs.readFileSync('question-response.js','utf8'),admin=fs.readFileSync('admin-question-review.js','utf8');
for(const source of [student,admin])assert.ok(source.includes("import('./assets/social-science-curriculum-supplement.js?v=20260828v1')"),'student and admin must load the same social/science supplement');
const context={window:{}};vm.createContext(context);
for(const file of ['question-data.js','curriculum-question-bank.js','assets/curriculum-content-expansion.js','assets/social-science-curriculum-supplement.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const sets=Object.values(context.window.StudyVillageQuestionSets||{});
const expected={사회:{units:4,minimum:20},과학:{units:8,minimum:15}};
for(const [subject,rule] of Object.entries(expected)){
 const subjectSets=sets.filter(set=>set.subject===subject&&/^\d단원/.test(set.unit||''));
 assert.equal(subjectSets.length,rule.units,`${subject} unit count changed`);
 for(const set of subjectSets){
  assert.ok(set.questions.length>=rule.minimum,`${set.activityId} needs at least ${rule.minimum} questions`);
  const ids=new Set(),prompts=new Set();
  for(const q of set.questions){
   assert.ok(!ids.has(q.id),`${set.activityId} duplicate id ${q.id}`);ids.add(q.id);
   assert.ok(!prompts.has(q.question),`${set.activityId} duplicate prompt`);prompts.add(q.question);
   assert.equal(q.options.length,4,`${q.id} needs four choices`);
   assert.equal(new Set(q.options).size,4,`${q.id} choices must be unique`);
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,`${q.id} answer index invalid`);
   assert.ok(q.spaces.includes('curriculum')&&q.spaces.includes('exploration'),`${q.id} must reach learning and exploration`);
  }
 }
}
assert.equal(sets.filter(s=>['사회','과학'].includes(s.subject)&&/^\d단원/.test(s.unit||'')).reduce((n,s)=>n+s.questions.length,0),201,'social/science core bank total changed');
console.log('social/science curriculum supplement contract self-test passed');
