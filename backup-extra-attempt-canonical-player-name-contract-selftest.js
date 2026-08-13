const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator-with-stars.js','utf8');
for(const token of [
  "const validExtraAttemptPlayerName=value=>{const raw=String(value??''),name=normalizePlayerName(raw);return !!name&&name.length<=12&&name===raw}",
  "if(!validExtraAttemptPlayerName(rawName))return{ok:false,code:'invalid-extra-attempt-history-player'",
  "if(!validExtraAttemptPlayerName(playerName)||encodeURIComponent(playerName)!==encodedName)return{ok:false,code:'invalid-extra-attempt-backup-player'"
])assert.ok(src.includes(token),`canonical extra-attempt player-name backup guard missing: ${token}`);
assert.ok(!src.includes("name===String(value??'').trim()"),'backup validation must not accept whitespace-padded player names');
console.log('backup extra-attempt canonical player name contract self-test passed');
