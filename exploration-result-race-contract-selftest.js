const assert=require('assert');
const fs=require('fs');
const hub=fs.readFileSync('assets/student-study-menu.js','utf8');
const guard=fs.readFileSync('assets/expedition-entry-guard.js','utf8');

assert.match(hub,/async function fetchJson\(url,options=\{\}\)/,'unified expedition requests must parse and preserve safe server failures');
assert.match(hub,/code:data\.code,status:response\.status/,'server rejection codes must survive to expedition result handling');
assert.match(hub,/error\?\.code==='attempt-limit-reached'/,'attempt-limit races must be distinguished from retryable connection failures');
assert.match(hub,/참여 횟수가 변경되었어요/,'students must be told when authoritative attempt state changed during an expedition');
assert.match(guard,/function normalizeTerminalResult\(stage\)/,'the expedition safety guard must normalize raced attempt-limit results');
assert.match(guard,/includes\('참여 횟수가 변경되었어요'\)/,'only authoritative attempt-limit result UI should be converted to terminal state');
assert.match(guard,/button\.textContent='우리 학습마을로 돌아가기 🏡'/,'attempt-limit rejection must return to the village instead of retrying forever');
assert.match(guard,/button\.dataset\.attemptLimitTerminal='true'/,'terminal result conversion must be idempotent');
assert.match(guard,/document\.body\.classList\.remove\('study-expedition-active'\)/,'terminal return must release expedition movement/overlay state');
assert.match(hub,/window\.dispatchEvent\(new Event\('studyvillage:activity-record-refresh'\)\)/,'successful saves must still refresh activity records');
console.log('unified exploration result race contract selftest passed');
