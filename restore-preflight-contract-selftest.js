import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('./admin.html',import.meta.url),'utf8');
const review=fs.readFileSync(new URL('./server/question-review.js',import.meta.url),'utf8');
const client=fs.readFileSync(new URL('./admin-restore-preflight.js',import.meta.url),'utf8');

const preflightIndex=html.indexOf('admin-restore-preflight.js');
const adminIndex=html.indexOf('admin.js');
assert.ok(preflightIndex>=0,'admin restore preflight script must be loaded');
assert.ok(adminIndex>=0,'admin.js must be loaded');
assert.ok(preflightIndex<adminIndex,'restore preflight must load before admin.js');
assert.match(review,/installRestorePreflightRoute/,'server question review routes must install restore preflight');
assert.match(review,/installRestorePreflightRoute\(app,\{requireAdmin\}\)/,'restore preflight must require admin authentication');
assert.match(client,/REQUEST_TIMEOUT_MS=5000/,'restore preflight client request must have a bounded wait');
assert.match(client,/signal:controller\.signal/,'restore preflight request must use AbortController signal');
assert.match(client,/restore-preflight-timeout/,'restore preflight timeout must return a distinct safe failure code');
assert.match(client,/복원 사전검사 시간이 초과되어 실제 복원을 시작하지 않았습니다\./,'teacher must be told that a timed-out preflight did not start restore');
assert.match(client,/clearTimeout\(timeout\)/,'restore preflight timeout timer must always be cleaned up');
console.log('restore preflight contract selftest: ok');
