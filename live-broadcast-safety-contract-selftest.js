/* v1.9 live classroom broadcast safety contract.
   Read-only source check: protects bounded requests and accidental repeat-send guards. */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const source=fs.readFileSync(new URL('./admin-live-events.js',import.meta.url),'utf8');

for(const token of ['REQUEST_TIMEOUT_MS=5000','RESEND_GUARD_MS=2000','AUDIENCE_REFRESH_MS=10000','maxlength="160"']){
  assert.ok(source.includes(token),`admin-live-events.js: missing ${token}`);
}
assert.match(source,/if\(sending\|\|now-lastSentAt<RESEND_GUARD_MS\)/,'repeat-send guard must remain');
assert.match(source,/AbortController\(\)/,'broadcast requests must remain timeout-bounded');
assert.match(source,/if\(clearDraftOnSuccess&&d\.recipients>0\)clearDraft\(\)/,'draft must clear only after a successful delivery');
assert.match(source,/if\(!token\(\)\|\|app\.hidden\|\|document\.hidden\|\|audienceLoading\)return/,'hidden admin view must not keep refreshing presence');

console.log('live broadcast safety contract: ok');
