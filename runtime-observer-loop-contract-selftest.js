const fs=require('fs'),assert=require('assert');
const student=fs.readFileSync('assets/student-stability-fixes.js','utf8');
const admin=fs.readFileSync('assets/admin-stability-bundle.js','utf8');

assert.ok(!student.includes("if(quiz.hidden)document.querySelector('#quiz-close')?.dispatchEvent"),'a hidden quiz observer must not click close recursively and starve the login event loop');
assert.ok(admin.includes("first&&first.textContent!=='학생 성장 현황'"),'admin observer must not rewrite unchanged navigation text');
assert.ok(admin.includes("heading&&heading.textContent!=='➕ 학생별 오늘 추가 도전 횟수'"),'admin observer must not rewrite unchanged heading text');
assert.ok(admin.includes('if(stabilizeQueued)return'),'admin mutation refresh must be coalesced to one animation frame');
console.log('runtime mutation observer loop contract self-test passed');
