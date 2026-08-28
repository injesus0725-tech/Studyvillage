const fs=require('fs'),vm=require('vm'),assert=require('assert');
for(const page of ['index.html','admin.html'])assert.ok(fs.readFileSync(page,'utf8').includes('assets/curriculum-content-expansion.js?v=20260828v1'),`${page} must load the same expanded question pack`);
const studentLoader=fs.readFileSync('question-response.js','utf8'),adminLoader=fs.readFileSync('admin-question-review.js','utf8');
assert.ok(studentLoader.includes("import('./assets/curriculum-content-supplement.js?v=20260828v1')"),'student runtime must start the supplemental question pack');
assert.ok(adminLoader.includes("import('./assets/curriculum-content-supplement.js?v=20260828v1')"),'admin runtime must load the same supplemental question pack');
assert.ok(adminLoader.includes('adminQuestionSupplementReady.then(()=>import(\'./assets/admin-question-catalog.js\'))'),'admin catalog must wait for supplemental questions');
const context={window:{}};vm.createContext(context);
for(const file of ['question-data.js','curriculum-question-bank.js','assets/curriculum-content-expansion.js','assets/curriculum-content-supplement.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const sets=Object.values(context.window.StudyVillageQuestionSets||{});
const korean=sets.filter(set=>set.subject==='국어'&&/^\d단원|^매체/.test(set.unit||''));
assert.equal(korean.length,14,'all fourteen Korean semester units must remain registered');
for(const set of korean)assert.ok(set.questions.length>=8,`${set.activityId} needs at least eight randomizable questions`);
const arts=sets.filter(set=>set.subject==='예체능');
assert.ok(arts.reduce((sum,set)=>sum+set.questions.length,0)>=55,'arts/PE/safety/health pool needs at least 55 questions');
const bookmaru=sets.find(set=>set.activityId==='library-vocabulary-grade3-supplement');
assert.ok(bookmaru&&bookmaru.subject==='국어','Bookmaru Korean vocabulary supplement must be registered');
assert.ok(bookmaru.questions.length>=24,'Bookmaru supplement needs at least 24 vocabulary questions');
assert.ok(bookmaru.questions.every(q=>q.spaces.includes('bookmaru')),'Bookmaru vocabulary questions must route only through Bookmaru');
const music=sets.find(set=>set.activityId==='curriculum-music-theory-supplement');
assert.ok(music&&music.subject==='음악','music theory supplement must be registered independently');
assert.ok(music.questions.length>=20,'music theory supplement needs at least 20 questions');
assert.ok(music.questions.every(q=>q.spaces.includes('curriculum')&&q.spaces.includes('exploration')),'music questions must reach learning and exploration pools');
for(const set of [...korean,...arts,bookmaru,music]){
 const ids=new Set(),prompts=new Set();
 for(const q of set.questions){
  assert.ok(!ids.has(q.id),`${set.activityId} duplicate id ${q.id}`);ids.add(q.id);
  assert.ok(!prompts.has(q.question),`${set.activityId} duplicate prompt`);prompts.add(q.question);
  assert.ok(q.options.length===4&&new Set(q.options).size===4,`${q.id} options must be four unique choices`);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,`${q.id} answer index invalid`);
  assert.ok(q.options[q.answer]&&q.explanation,`${q.id} needs a reachable answer and explanation`);
 }
}
console.log('curriculum content expansion + supplement contract self-test passed');
