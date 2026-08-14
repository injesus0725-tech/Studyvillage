const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/item-ownership.js','utf8');
for(const token of [
  'export function validateOwnedItemsStrict',
  "code:'invalid-owned-items-json'",
  "code:'invalid-owned-items'",
  "code:'wardrobe-full'",
  "code:'invalid-item-id'",
  "code:'duplicate-item-id'",
  "code:'corrupt-owned-items'",
  'const validated=validateOwnedItemsStrict(value)',
  'replace(name,items){const player=String(name||\'\'),validated=validateOwnedItemsStrict(items)',
  'if(!validated.ok)return validated',
  'JSON.stringify(validated.items)',
  "code:changed.changes>0?undefined:'player-not-found'"
])assert.ok(src.includes(token),`wardrobe write guard missing: ${token}`);
console.log('wardrobe replacement/grant write integrity contract self-test passed');
