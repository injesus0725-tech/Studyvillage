const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/activity-attempt-exceptions.js','utf8');
for(const token of [
  'export function removeExtraAttemptStudentData',
  "const prefix=`${PREFIX}${encodeURIComponent(playerName)}:`",
  "if(typeof getSetting!=='function'||typeof setSetting!=='function'||typeof deleteSetting!=='function'||typeof listSettingKeys!=='function')return{ok:false,code:'invalid-cleanup-adapter'}",
  "if(typeof key==='string'&&key.startsWith(prefix)){deleteSetting(key);removedSettings++}",
  "const filtered=rows.filter(row=>String(row?.name||'')!==playerName)",
  "setSetting(HISTORY_KEY,JSON.stringify(filtered.slice(-1000)))",
  'removedHistory:rows.length-filtered.length'
])assert.ok(src.includes(token),`student extra-attempt cleanup guard missing: ${token}`);
assert.ok(src.indexOf('deleteSetting(key)')<src.indexOf('const filtered=rows.filter'),'per-activity balances should be removed before history is rewritten');
console.log('activity extra-attempt student delete history cleanup contract self-test passed');
