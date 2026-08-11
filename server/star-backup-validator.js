/* v1.9 star backup payload validator. Pure validation only; no DB writes. */
const MAX_STARS=1000000;
const MAX_MIRROR_ENTRIES=500;

function validInteger(value,min=0,max=MAX_STARS){
  const number=Number(value);
  return Number.isInteger(number)&&number>=min&&number<=max;
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
  for(let index=0;index<entries.length;index++){
    const row=entries[index]||{},before=Number(row.beforeValue),after=Number(row.afterValue),delta=Number(row.delta);
    if(!validInteger(before)||!validInteger(after)||!Number.isInteger(delta)||after-before!==delta)errors.push(`invalid-star-mirror-values:${index}`);
    if(!String(row.kind||'').trim())errors.push(`star-mirror-kind-missing:${index}`);
    if(!String(row.createdAt||'').trim())errors.push(`star-mirror-created-at-missing:${index}`);
  }
  return{ok:errors.length===0,errors:errors.slice(0,100),entryCount:entries.length};
}

export function validateStarBackupPayload(data){
  const balances=Array.isArray(data?.balances)?data.balances:[];
  const ledger=Array.isArray(data?.ledger)?data.ledger:[];
  const errors=[];
  const seenPlayers=new Set();

  for(const row of balances){
    const name=String(row?.playerName||'').trim();
    const stars=Number(row?.stars);
    if(!name)errors.push('balance-player-name-missing');
    if(name&&seenPlayers.has(name))errors.push(`duplicate-balance:${name}`);
    if(name)seenPlayers.add(name);
    if(!validInteger(stars))errors.push(`invalid-balance:${name||'unknown'}`);
  }

  let previousId=0;
  for(const row of ledger){
    const id=Number(row?.id);
    const before=Number(row?.before_value);
    const after=Number(row?.after_value);
    const delta=Number(row?.delta);
    const name=String(row?.player_name||'').trim();
    if(!Number.isInteger(id)||id<=0||id<=previousId)errors.push(`invalid-ledger-id:${id}`);else previousId=id;
    if(!name)errors.push(`ledger-player-name-missing:${id||'unknown'}`);
    if(!validInteger(before)||!validInteger(after)||!Number.isInteger(delta)||after-before!==delta)errors.push(`invalid-ledger-values:${id||'unknown'}`);
    if(!String(row?.kind||'').trim())errors.push(`ledger-kind-missing:${id||'unknown'}`);
    if(!String(row?.created_at||'').trim())errors.push(`ledger-created-at-missing:${id||'unknown'}`);
  }

  return{ok:errors.length===0,errors:errors.slice(0,100),balanceCount:balances.length,ledgerCount:ledger.length};
}
