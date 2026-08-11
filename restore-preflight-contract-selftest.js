import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('./admin.html',import.meta.url),'utf8');
const review=fs.readFileSync(new URL('./server/question-review.js',import.meta.url),'utf8');

const preflightIndex=html.indexOf('admin-restore-preflight.js');
const adminIndex=html.indexOf('admin.js');
assert.ok(preflightIndex>=0,'admin restore preflight script must be loaded');
assert.ok(adminIndex>=0,'admin.js must be loaded');
assert.ok(preflightIndex<adminIndex,'restore preflight must load before admin.js');
assert.match(review,/installRestorePreflightRoute/,'server question review routes must install restore preflight');
assert.match(review,/installRestorePreflightRoute\(app,\{requireAdmin\}\)/,'restore preflight must require admin authentication');
console.log('restore preflight contract selftest: ok');
