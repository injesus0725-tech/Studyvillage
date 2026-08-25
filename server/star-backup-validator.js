/* v1.12 star backup payload validator. Pure validation only; no DB writes. */
const MAX_STARS=1000000;
const MAX_MIRROR_ENTRIES=500;
const SHOP_ITEM_IDS=new Set(['cap-blue','crown-gold','glasses-round','backpack','pet-chick','pet-cat','leaf-cap','scholar-cap','explorer-goggles','star-monocle','field-satchel','book-pack','pet-owl','pet-fox','hair-short','hair-bob','hair-ponytail','hair-blue','hat-wizard','hat-pirate','hat-flower','glasses-sun','glasses-heart','outfit-hoodie','outfit-uniform','outfit-wizard','outfit-armor','bottom-jeans','bottom-shorts','bottom-skirt','shoes-sneakers','shoes-boots','shoes-wing','bag-art','bag-rocket','hand-sword','hand-wand','hand-book','hand-magnifier','pet-dog','pet-rabbit','pet-dragon','pet-slime','aurora-effect']);

function validInteger(value,min=0,max=MAX_STARS){
  const number=Number(value);
  return Number.isInteger(number)&&number>=min&&number<=max;
}
function validatePurchaseSemantics({kind,referenceId,delta},errorPrefix){
  if(kind!=='item-purchase')return null;
  if(!SHOP_ITEM_IDS.has(String(referenceId||'')))return `${errorPrefix}-item-purchase-reference`;
  if(!Number.isInteger(delta)||delta>=0)return `${errorPrefix}-item-purchase-delta`;
  return null;
}

export function validateStarMirrorValue(value){
  const errors=[];
  let mirror=value;
  if(typeof value==='string'){
    try{mirror=JSON.parse(value)}catch{return{ok:false,errors:['invalid-star-mirror-json'],entryCount:0}}
  }
  if(!mirror||typeof mirror!=='object'||Array.isArray(mirror))return{ok:false,errors:['invalid-star-mirror'],entryCount:0};
  if(!validInteger(mirror.balance))errors.push('invalid-star-mirror-balance');
  if(!Array.isArray(mirror.entries))errors.push('invalid-star-mirror-entries');
  const entries=Array.isArray(mirror.entries)?mirror.entries:[];
  if(entries.length>MAX_MIRROR_ENTRIES)errors.push('too-many-star-mirror-entries');
  let previous=null;
  for(let index=0;index<entries.length;index++){
    const row=entries[index]||{},before=Number(row.beforeValue),after=Number(row.afterValue),delta=Number(row.delta),kind=String(row.kind||'').trim(),referenceId=row.referenceId;
    if(!validInteger(before)||!validInteger(after)||!Number.isInteger(delta)||after-before!==delta)errors.push(`invalid-star-mirror-values:${index}`);
    if(previous&&previous.after!==before)errors.push(`star-mirror-discontinuity:${index}`);
    if(!kind)errors.push(`star-mirror-kind-missing:${index}`);
    const purchaseError=validatePurchaseSemantics({kind,referenceId,delta},`star-mirror:${index}`);if(purchaseError)errors.push(purchaseError);
    if(!String(row.createdAt||'').trim())errors.push(`star-mirror-created-at-missing:${index}`);
    previous={after};
  }
  if(entries.length&&validInteger(mirror.balance)&&Number(entries[entries.length-1]?.afterValue)!==Number(mirror.balance))errors.push('star-mirror-balance-history-mismatch');
  return{ok:errors.length===0,errors:errors.slice(0,100),entryCount:entries.length};
}

export function validateStarBackupPayload(data){
  const balances=Array.isArray(data?.balances)?data.balances:[];
  const ledger=Array.isArray(data?.ledger)?data.ledger:[];
  const errors=[];
  const seenPlayers=new Set(),balanceByPlayer=new Map();

  for(const row of balances){
    const name=String(row?.playerName||'').trim();
    const stars=Number(row?.stars);
    if(!name)errors.push('balance-player-name-missing');
    if(name&&seenPlayers.has(name))errors.push(`duplicate-balance:${name}`);
    if(name)seenPlayers.add(name);
    if(!validInteger(stars))errors.push(`invalid-balance:${name||'unknown'}`);
    if(name&&validInteger(stars))balanceByPlayer.set(name,stars);
  }

  let previousId=0;
  const latestByPlayer=new Map();
  for(const row of ledger){
    const id=Number(row?.id);
    const before=Number(row?.before_value);
    const after=Number(row?.after_value);
    const delta=Number(row?.delta);
    const name=String(row?.player_name||'').trim();
    const kind=String(row?.kind||'').trim(),referenceId=row?.reference_id;
    if(!Number.isInteger(id)||id<=0||id<=previousId)errors.push(`invalid-ledger-id:${id}`);else previousId=id;
    if(!name)errors.push(`ledger-player-name-missing:${id||'unknown'}`);
    if(name&&!balanceByPlayer.has(name))errors.push(`orphan-ledger-player:${name}`);
    if(!validInteger(before)||!validInteger(after)||!Number.isInteger(delta)||after-before!==delta)errors.push(`invalid-ledger-values:${id||'unknown'}`);
    const previous=latestByPlayer.get(name);
    if(name&&previous&&previous.after!==before)errors.push(`ledger-discontinuity:${name}:${id||'unknown'}`);
    if(name)latestByPlayer.set(name,{id,after});
    if(!kind)errors.push(`ledger-kind-missing:${id||'unknown'}`);
    const purchaseError=validatePurchaseSemantics({kind,referenceId,delta},`ledger:${id||'unknown'}`);if(purchaseError)errors.push(purchaseError);
    if(!String(row?.created_at||'').trim())errors.push(`ledger-created-at-missing:${id||'unknown'}`);
  }
  for(const [name,latest] of latestByPlayer){
    if(balanceByPlayer.has(name)&&balanceByPlayer.get(name)!==latest.after)errors.push(`ledger-balance-mismatch:${name}`);
  }

  return{ok:errors.length===0,errors:errors.slice(0,100),balanceCount:balances.length,ledgerCount:ledger.length};
}
