const fs=require('fs'),assert=require('assert'),src=fs.readFileSync('activity-checkpoint.js','utf8');
const remote=src.slice(src.indexOf('function remote('),src.indexOf('function save('));
assert.ok(remote.includes('function remote(playerName,activityId,options)'),'remote checkpoint writes must carry their originating student scope');
assert.ok(remote.indexOf('headers=window.StudyVillageAuth?.authHeaders?.()')<remote.indexOf('previous.catch(()=>{}).then'),'authentication must be captured when queued, not reread after another login');
assert.ok(remote.includes('const queueKey=`${part(playerName)}:${part(id)}`'),'different students must not share one activity write queue');
assert.ok(remote.includes('remoteQueues.get(queueKey)')&&remote.includes('remoteQueues.set(queueKey,work)'),'ordering must use the student-scoped queue key');
assert.ok(src.includes("remote(playerName,activityId,{method:'PUT'")&&src.includes("remote(playerName,activityId,{method:'DELETE'})"),'both save and clear must preserve the student scope');
console.log('checkpoint session isolation contract self-test passed');
