/* v1.9 startup request deduplication contract.
   Development-only selftest: protects login/session startup from accidental duplicate network work while allowing one bounded retry after a temporary startup miss. */
import fs from 'node:fs';

const auth=fs.readFileSync(new URL('./auth.js',import.meta.url),'utf8');
const restore=fs.readFileSync(new URL('./session-restore.js',import.meta.url),'utf8');

if(!/serverCheck/.test(auth))throw new Error('auth.js: shared in-flight server check guard is missing');
if(!/if\(serverCheck&&!force\)return serverCheck/.test(auth))throw new Error('auth.js: concurrent server checks are no longer deduplicated');
if(!/if\(restoring\|\|finished/.test(restore))throw new Error('session-restore.js: duplicate restore guard is missing');
if(!/finished=true/.test(restore))throw new Error('session-restore.js: successful restore completion guard is missing');
if(!/retryUsed=false/.test(restore))throw new Error('session-restore.js: bounded retry state is missing');
if(!/if\(retry&&retryUsed\)return/.test(restore))throw new Error('session-restore.js: repeated retry guard is missing');
if(!/window\.addEventListener\('online',retryRestore,\{once:true\}\)/.test(restore))throw new Error('session-restore.js: reconnect retry hook is missing');
if(!/window\.addEventListener\('focus',retryRestore,\{once:true\}\)/.test(restore))throw new Error('session-restore.js: first-focus retry hook is missing');
if(!/name\.value\|\|password\.value/.test(restore))throw new Error('session-restore.js: retry must not override student typing');

console.log('startup request contract selftest passed');
