const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator-with-stars.js','utf8');
for(const token of [
  "const validCanonicalPlayerName=value=>{const raw=String(value??''),name=normalizePlayerName(raw);return !!name&&name.length<=12&&name===raw}",
  "if(!validCanonicalPlayerName(playerName)||encodeURIComponent(playerName)!==encodedName)return{ok:false,code:'invalid-star-backup-player'",
  "if(!validCanonicalPlayerName(playerName)||encodeURIComponent(playerName)!==encodedName)return{ok:false,code:'invalid-extra-attempt-backup-player'"
])assert.ok(src.includes(token),`canonical backup player key guard missing: ${token}`);
assert.ok(!src.includes('validExtraAttemptPlayerName'),'star and extra-attempt backup keys must share one canonical player-name rule');
console.log('backup canonical star and extra-attempt player key contract self-test passed');
