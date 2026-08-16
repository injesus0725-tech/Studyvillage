const fs=require('fs'),assert=require('assert');
const session=fs.readFileSync('student-session.js','utf8');

assert.ok(session.includes("if(event.key!=='Escape')return"),'activity navigation must respond only to the app-internal back action');
assert.ok(session.includes('.math-practice-panel:not([hidden]) .quiz-close'),'back must close an open math activity');
assert.ok(session.includes('#library-game:not([hidden]) #library-close'),'back must close an open vocabulary activity');
assert.ok(session.includes('event.preventDefault();event.stopImmediatePropagation();closeActivity.click()'),'only the top learning activity may consume one back action');
assert.ok(session.includes('},true);'),'activity back handling must run before background village handlers');
console.log('student activity back navigation contract self-test passed');
