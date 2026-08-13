const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator.js','utf8');
for(const token of [
  "const canonicalPlayerName=v=>{const raw=String(v??''),name=raw.trim();return name&&name.length<=12&&name===raw?name:''}",
  "const name=canonicalPlayerName(p?.name)",
  "if(!name||names.has(name))return fail('invalid-player-name'"
])assert.ok(src.includes(token),`canonical backup player-name guard missing: ${token}`);
assert.ok(!src.includes("const name=String(p?.name||'').trim();if(!name||name.length>12"),'backup validator must not silently trim player names into a valid identity');
console.log('backup canonical player name contract self-test passed');
