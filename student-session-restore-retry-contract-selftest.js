const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('session-restore.js','utf8');

assert.ok(src.includes('let restoring=false,finished=false,retryUsed=false,initialAttemptDone=false,listenersAttached=false'),'session restore must track retry lifecycle and listener state');
assert.ok(src.includes('function retryRestore()'),'session restore must provide a guarded retry path');
assert.ok(src.includes('if(!initialAttemptDone||retryUsed||finished||name.value||password.value||!title.classList.contains(\'active\'))return'),'retry must wait for the initial attempt and avoid interfering with student input');
assert.ok(src.includes("window.addEventListener('online',retryRestore);"),'online recovery must remain available after an early event');
assert.ok(src.includes("window.addEventListener('focus',retryRestore);"),'focus recovery must remain available after an early event');
assert.ok(!src.includes("window.addEventListener('online',retryRestore,{once:true})"),'an early online event must not consume the only retry opportunity');
assert.ok(!src.includes("window.addEventListener('focus',retryRestore,{once:true})"),'an early focus event must not consume the only retry opportunity');
assert.ok(src.includes('if(retry&&retryUsed)return;')&&src.includes('if(retry){retryUsed=true;removeRetryListeners()}'),'retry execution itself must still be limited to one attempt and release retry listeners');
assert.ok(src.includes('function removeRetryListeners()'),'session restore must provide listener cleanup');
assert.ok(src.includes("window.removeEventListener('online',retryRestore)")&&src.includes("window.removeEventListener('focus',retryRestore)"),'session restore must release both retry listeners');
assert.ok((src.match(/removeRetryListeners\(\)/g)||[]).length>=4,'retry listeners must be released on retry use and terminal restore paths');

console.log('student session restore retry contract self-test passed');
