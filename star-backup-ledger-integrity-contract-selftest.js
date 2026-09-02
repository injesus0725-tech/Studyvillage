const fs=require('fs');
const assert=require('assert');
const star=fs.readFileSync('server/star-backup-validator.js','utf8');
const combined=fs.readFileSync('server/backup-validator-with-stars.js','utf8');
for(const token of [
  "import { avatarShopPackV3 } from './avatar-shop-pack-v3.js'",
  'entries.length>MAX_MIRROR_ENTRIES',
  'after-before!==delta',
  'previous&&previous.after!==before',
  'star-mirror-discontinuity:',
  'star-mirror-balance-history-mismatch',
  'duplicate-balance:',
  'balanceByPlayer=new Map()',
  'id<=previousId',
  'ledger-player-name-missing:',
  'orphan-ledger-player:',
  'ledger-discontinuity:',
  'ledger-balance-mismatch:',
  'ledger-kind-missing:',
  'SHOP_ITEM_IDS',
  "kind!=='item-purchase'",
  'item-purchase-reference',
  'item-purchase-delta',
  'ledger-created-at-missing:'
])assert.ok(star.includes(token),`star backup ledger guard missing: ${token}`);
for(const token of [
  "code:'orphan-star-backup-setting'",
  "code:'invalid-star-backup-setting'",
  "code:'star-balance-mismatch'",
  'ownedByPlayer=new Map()',
  "String(entry?.kind||'')!=='item-purchase'",
  "code:'invalid-item-purchase-reference'",
  "code:'invalid-item-purchase-delta'",
  "code:'item-purchase-ownership-mismatch'"
])assert.ok(combined.includes(token),`combined star backup guard missing: ${token}`);
console.log('star backup ledger and item purchase integrity contract self-test passed');
