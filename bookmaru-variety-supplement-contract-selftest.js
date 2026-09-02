const fs=require('fs'),assert=require('assert'),vm=require('vm');
const source=fs.readFileSync('assets/bookmaru-variety-supplement.js','utf8');
const sandbox={window:{StudyVillageQuestionSets:{}}};vm.runInNewContext(source,sandbox,{filename:'assets/bookmaru-variety-supplement.js'});
const sets=Object.values(sandbox.window.StudyVillageQuestionSets||{}),questions=sets.flatMap(set=>set.questions||[]);
assert.strictEqual(sets.length,6,'Bookmaru variety supplement must keep six category/source sets');
assert.strictEqual(questions.length,32,'Bookmaru variety supplement must provide 32 questions');
for(const set of sets){assert.deepStrictEqual(Array.from(set.spaces||[]),['bookmaru'],`${set.activityId} must stay Bookmaru-only`);assert.ok(set.questions.length>=3,`${set.activityId} must contain usable variety`)}
for(const q of questions){assert.ok(typeof q.question==='string'&&q.question.trim(),'every Bookmaru question needs a prompt');assert.ok(Array.isArray(q.options)&&q.options.length===4,'every Bookmaru variety question needs four options');assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length,'every Bookmaru variety question needs a valid answer');assert.ok(typeof q.explanation==='string'&&q.explanation.trim(),'every Bookmaru variety question needs a short explanation')}
const byUnit=new Map(sets.map(set=>[set.unit,set.questions.length]));
assert.strictEqual(byUnit.get('책마루 수수께끼'),10,'Bookmaru needs ten riddle questions');
assert.strictEqual(byUnit.get('책마루 상식'),10,'Bookmaru needs ten general-knowledge questions');
assert.strictEqual([...byUnit].filter(([unit])=>unit.startsWith('책마루 교과 ')).reduce((sum,[,count])=>sum+count,0),12,'Bookmaru needs twelve light textbook-review questions');
for(const subject of ['국어','수학','사회','과학'])assert.ok(sets.some(set=>set.subject===subject),`Bookmaru textbook mix must include ${subject}`);
assert.strictEqual(new Set(questions.map(q=>q.id)).size,questions.length,'Bookmaru variety question ids must be unique');
console.log('Bookmaru variety supplement contract self-test passed');
