/* v1.9 startup request deduplication contract.
   Development-only selftest: protects login/session startup from accidental duplicate network work. */
import fs from 'node:fs';

const auth=fs.readFileSync(new URL('./auth.js',import.meta.url),'utf8');
const restore=fs.readFileSync(new URL('./session-restore.js',import.meta.url),'utf8');

if(!/serverCheck/.test(auth))throw new Error('auth.js: shared in-flight server check guard is missing');
if(!/if\(serverCheck&&!force\)return serverCheck/.test(auth))throw new Error('auth.js: concurrent server checks are no longer deduplicated');
if(!/if\(restoring\|\|finished/.test(restore))throw new Error('session-restore.js: duplicate restore guard is missing');
if(!/finished=true/.test(restore))throw new Error('session-restore.js: one-shot restore completion guard is missing');

console.log('startup request contract selftest passed');
