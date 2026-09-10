import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=fs.readFileSync(new URL('./question-data.js',import.meta.url),'utf8');
const context={window:{}};vm.createContext(context);vm.runInContext(source,context);
const sets=context.window.StudyVillageQuestionSets||{};
const ids=new Set();
for(const [key,set] of Object.entries(sets)){
  assert.ok(set&&typeof set==='object',`${key}: question set required`);
  assert.match(String(set.activityId||''),/^[a-z0-9-]{1,40}$/,`${key}: valid activityId required`);
  assert.ok(!ids.has(set.activityId),`${key}: duplicate activityId ${set.activityId}`);ids.add(set.activityId);
  assert.ok(typeof set.subject==='string'&&set.subject.trim().length>0&&set.subject.trim().length<=40,`${key}: subject required`);
  assert.ok(typeof set.topic==='string'&&set.topic.trim().length>0&&set.topic.trim().length<=80,`${key}: topic required`);
  for(const field of ['grade','semester','unit','difficulty','spaces'])assert.ok(set[field]!==undefined,`${key}: ${field} metadata required`);
  assert.ok(Array.isArray(set.questions)&&set.questions.length>0,`${key}: questions required`);
  for(const question of set.questions){assert.match(String(question.id||''),/^[a-z0-9-]{2,80}$/,`${key}: stable question id required`);assert.equal(typeof question.enabled,'boolean',`${key}: enabled flag required`);assert.ok(Array.isArray(question.spaces)&&question.spaces.length,`${key}: output spaces required`)}
}
console.log(`question metadata selftest: ok (${ids.size} sets)`);
