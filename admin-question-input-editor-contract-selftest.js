const fs=require('fs');
const assert=require('assert');
const admin=fs.readFileSync('admin-question-editor.js','utf8'),server=fs.readFileSync('server/question-overrides.js','utf8');
for(const token of ["inputType=before.type==='input'","(before.acceptedAnswers||[]).join(', ')","acceptedAnswers=raw.split(',').map(value=>value.trim()).filter(Boolean)",'acceptedAnswers.length>8','new Set(normalized).size!==normalized.length',"type:inputType?'input':'choice'",'answerSummary=inputType?`인정 정답:'])assert.ok(admin.includes(token),`admin input editor missing: ${token}`);
assert.ok(admin.includes("if(word.length>300)"),'question prompt length must be bounded before save');
assert.ok(server.includes('q.acceptedAnswers.length<=8'),'server must bound accepted input answers');
assert.ok(server.includes('new Set(normalized).size===normalized.length'),'server must reject duplicate accepted answers independently of the browser');
assert.ok(server.includes('if(!prompt)return false'),'server must reject blank input prompts');
console.log('admin question input editor contract self-test passed');
