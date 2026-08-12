const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('server/backup-validator-with-stars.js','utf8');
for(const token of [
  "import { parseOwnedItems } from './item-ownership.js'",
  'function equippedItemIds(value)',
  "const owned=new Set(parseOwnedItems(player?.owned_items_json||'[]'))",
  "code:'equipped-item-not-owned'"
])assert.ok(src.includes(token),`backup equipment ownership guard missing: ${token}`);
console.log('backup equipment ownership contract self-test passed');
