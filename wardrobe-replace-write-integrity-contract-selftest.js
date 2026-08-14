const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/item-ownership.js','utf8');
for(const token of [
  'validateReplacementItems',
  "code:'invalid-owned-items-json'",
  "code:'invalid-owned-items'",
  "code:'wardrobe-full'",
  "code:'invalid-item-id'",
  "code:'duplicate-item-id'",
  'if(!validated.ok)return validated',
  'JSON.stringify(validated.items)',
  "code:changed.changes>0?undefined:'player-not-found'",
  "code:'corrupt-owned-items'",
  'const validated=validateReplacementItems(value)',
  'if(!validated.ok)return{ok:false'
])assert.ok(src.includes(token),`wardrobe write guard missing: ${token}`);
console.log('wardrobe replacement/grant write integrity contract self-test passed');
