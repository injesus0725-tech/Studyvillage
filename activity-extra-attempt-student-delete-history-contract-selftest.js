const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
for(const token of [
  'export function removeExtraAttemptStudentData',
  "const prefix=`${PREFIX}${encodeURIComponent(playerName)}:`",
  "if(typeof getSetting!=='function'||typeof setSetting!=='function'||typeof deleteSetting!=='function'||typeof listSettingKeys!=='function')return{ok:false,code:'invalid-cleanup-adapter'}",
  "const store=parseHistoryStore(getSetting);if(!store.ok)return store",
  "const filtered=store.rows.filter(row=>String(row?.name||'')!==playerName)",
  "if(typeof key==='string'&&key.startsWith(prefix)){deleteSetting(key);removedSettings++}",
  "setSetting(HISTORY_KEY,JSON.stringify(filtered.slice(-1000)))",
  'removedHistory:store.rows.length-filtered.length'
])assert.ok(src.includes(token),`student extra-attempt cleanup guard missing: ${token}`);
const fnStart=src.indexOf('export function removeExtraAttemptStudentData'),fnEnd=src.indexOf('\nexport function setExtraAttempts',fnStart),body=src.slice(fnStart,fnEnd);
assert.ok(body.indexOf('const store=parseHistoryStore(getSetting);if(!store.ok)return store')<body.indexOf('deleteSetting(key)'),'corrupted history must stop cleanup before any balance key is deleted');
assert.ok(body.indexOf('const filtered=store.rows.filter')<body.indexOf('deleteSetting(key)'),'history cleanup plan must be prepared before destructive balance deletion');
console.log('activity extra-attempt fail-closed student delete history cleanup contract self-test passed');
