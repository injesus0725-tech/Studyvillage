/* v1.9 star backup payload validator. Pure validation only; no DB writes. */
const MAX_STARS=1000000;

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
    if(!Number.isInteger(stars)||stars<0||stars>MAX_STARS)errors.push(`invalid-balance:${name||'unknown'}`);
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
    if(!Number.isInteger(before)||!Number.isInteger(after)||!Number.isInteger(delta)||before<0||after<0||before>MAX_STARS||after>MAX_STARS||after-before!==delta)errors.push(`invalid-ledger-values:${id||'unknown'}`);
    if(!String(row?.kind||'').trim())errors.push(`ledger-kind-missing:${id||'unknown'}`);
    if(!String(row?.created_at||'').trim())errors.push(`ledger-created-at-missing:${id||'unknown'}`);
  }

  return{ok:errors.length===0,errors:errors.slice(0,100),balanceCount:balances.length,ledgerCount:ledger.length};
}
