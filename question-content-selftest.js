import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=fs.readFileSync(new URL('./question-data.js',import.meta.url),'utf8');
const context={window:{}};
vm.createContext(context);
vm.runInContext(source,context);

const normalize=value=>String(value??'').trim().replace(/\s+/g,' ').toLocaleLowerCase('ko-KR');
const sets=context.window.StudyVillageQuestionSets||{};
for(const [setKey,set] of Object.entries(sets)){
  for(const [index,question] of set.questions.entries()){
    const label=`${setKey}[${index}]`;
    assert.ok(question&&typeof question==='object',`${label}: question required`);
    if(question.type==='input'){
      assert.ok(Array.isArray(question.acceptedAnswers)&&question.acceptedAnswers.length>0,`${label}: input answers required`);
      assert.ok(question.acceptedAnswers.every(answer=>typeof answer==='string'&&answer.trim()),`${label}: input answers must be non-empty strings`);
      const prompt=normalize(question.word);
      for(const answer of question.acceptedAnswers)assert.ok(!prompt.includes(normalize(answer)),`${label}: input prompt must not reveal an accepted answer`);
      continue;
    }
    assert.ok(Array.isArray(question.options)&&question.options.length>=2,`${label}: at least two options required`);
    assert.ok(question.options.every(option=>typeof option==='string'&&option.trim().length>0),`${label}: options must be non-empty strings`);
    const normalizedOptions=question.options.map(option=>option.trim());
    assert.equal(new Set(normalizedOptions).size,normalizedOptions.length,`${label}: duplicate options are not allowed`);
    assert.ok(Number.isInteger(question.answer)&&question.answer>=0&&question.answer<question.options.length,`${label}: answer must point to an option`);
  }
}

console.log('question content selftest: ok');
