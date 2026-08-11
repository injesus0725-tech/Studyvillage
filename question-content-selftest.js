import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=fs.readFileSync(new URL('./question-data.js',import.meta.url),'utf8');
const context={window:{}};
vm.createContext(context);
vm.runInContext(source,context);

const sets=context.window.StudyVillageQuestionSets||{};
for(const [setKey,set] of Object.entries(sets)){
  for(const [index,question] of set.questions.entries()){
    const label=`${setKey}[${index}]`;
    assert.ok(question&&typeof question==='object',`${label}: question required`);
    assert.ok(Array.isArray(question.options)&&question.options.length>=2,`${label}: at least two options required`);
    assert.ok(question.options.every(option=>typeof option==='string'&&option.trim().length>0),`${label}: options must be non-empty strings`);
    assert.ok(Number.isInteger(question.answer)&&question.answer>=0&&question.answer<question.options.length,`${label}: answer must point to an option`);
  }
}

console.log('question content selftest: ok');
