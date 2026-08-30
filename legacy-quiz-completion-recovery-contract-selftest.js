const fs=require('fs'),assert=require('assert');
const stability=fs.readFileSync('assets/student-stability-fixes.js','utf8'),guard=fs.readFileSync('assets/student-riddle-completion-guard.js','utf8'),loader=fs.readFileSync('assets/student-question-overrides.js','utf8');
for(const token of ["legacyQuizHall.style.setProperty('left','-10000px','important')","legacyQuizHall.style.setProperty('visibility','hidden','important')","legacyQuizPanel.hidden=true"])assert.ok(stability.includes(token),`retired legacy quiz guard missing ${token}`);
for(const retired of ['수수께끼 도전 시작','legacyQuizRetryInstalled','makeCompletedQuizReturnSafe','data-save-recovery-exit'])assert.ok(!stability.includes(retired),`retired standalone quiz behavior returned: ${retired}`);
assert.ok(guard.includes('quiz.hidden=true')&&guard.includes('studyvillage:return-to-village'),'old completion guard may remain only as a harmless cleanup path for stale sessions');
assert.ok(loader.includes("import('./student-riddle-completion-guard.js')"),'stale-session cleanup guard should remain loadable while old checkpoints age out');
console.log('retired legacy quiz completion contract self-test passed');
