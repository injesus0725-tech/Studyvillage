const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator-with-stars.js','utf8');
for(const token of [
  "const validCanonicalPlayerName=value=>{const raw=String(value??''),name=normalizePlayerName(raw);return !!name&&name.length<=12&&name===raw}",
  "if(!validCanonicalPlayerName(rawName))return{ok:false,code:'invalid-extra-attempt-history-player'",
  "if(!validCanonicalPlayerName(playerName)||encodeURIComponent(playerName)!==encodedName)return{ok:false,code:'invalid-extra-attempt-backup-player'"
])assert.ok(src.includes(token),`canonical extra-attempt player-name backup guard missing: ${token}`);
assert.ok(!src.includes("name===String(value??'').trim()"),'backup validation must not accept whitespace-padded player names');
assert.ok(src.includes("if(!validCanonicalPlayerName(playerName)||encodeURIComponent(playerName)!==encodedName)return{ok:false,code:'invalid-star-backup-player'"),'star backup keys must share the same canonical player-name guard');
console.log('backup extra-attempt canonical player name contract self-test passed');
