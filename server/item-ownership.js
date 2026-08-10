/* v0.9.93 lightweight permanent wardrobe ownership helpers.
   Ownership is stored as a compact JSON array of item IDs per player.
   Bought items stay owned even when unequipped; the shop can mark them as owned and the wardrobe can re-equip them later.
   Database adapter keeps all wardrobe persistence rules in one place so server/shop code does not duplicate JSON handling. */

const SAFE_ID=/^[a-z0-9-]{1,80}$/;
const MAX_OWNED_ITEMS=500;

export function parseOwnedItems(value){
  try{
    const raw=typeof value==='string'?JSON.parse(value):value;
    if(!Array.isArray(raw))return[];
    const unique=[];
    const seen=new Set();
    for(const entry of raw){
      const id=String(entry||'');
      if(!SAFE_ID.test(id)||seen.has(id))continue;
      seen.add(id);unique.push(id);
      if(unique.length>=MAX_OWNED_ITEMS)break;
    }
    return unique;
  }catch{return[]}
}

export function serializeOwnedItems(items){return JSON.stringify(parseOwnedItems(items))}
export function ownsItem(value,itemId){return parseOwnedItems(value).includes(String(itemId||''))}
export function addOwnedItem(value,itemId){const id=String(itemId||'');if(!SAFE_ID.test(id))return{ok:false,code:'invalid-item-id',items:parseOwnedItems(value)};const items=parseOwnedItems(value);if(items.includes(id))return{ok:true,alreadyOwned:true,items};if(items.length>=MAX_OWNED_ITEMS)return{ok:false,code:'wardrobe-full',items};items.push(id);return{ok:true,alreadyOwned:false,items}}

export function installWardrobeStorage(db){
  const columns=db.prepare('PRAGMA table_info(players)').all().map(row=>row.name);
  if(!columns.includes('owned_items_json'))db.exec("ALTER TABLE players ADD COLUMN owned_items_json TEXT NOT NULL DEFAULT '[]'");
  const read=db.prepare('SELECT owned_items_json FROM players WHERE name=?');
  const write=db.prepare('UPDATE players SET owned_items_json=?,updated_at=? WHERE name=?');
  return Object.freeze({
    get(name){const row=read.get(String(name||''));return row?parseOwnedItems(row.owned_items_json):null},
    owns(name,itemId){const row=read.get(String(name||''));return !!row&&ownsItem(row.owned_items_json,itemId)},
    grant(name,itemId){const player=String(name||''),row=read.get(player);if(!row)return{ok:false,code:'player-not-found',items:[]};const result=addOwnedItem(row.owned_items_json,itemId);if(!result.ok||result.alreadyOwned)return result;write.run(serializeOwnedItems(result.items),new Date().toISOString(),player);return result},
    replace(name,items){const player=String(name||''),normalized=parseOwnedItems(items);const changed=write.run(serializeOwnedItems(normalized),new Date().toISOString(),player);return{ok:changed.changes>0,items:normalized}}
  });
}

export const wardrobeLimits=Object.freeze({maxOwnedItems:MAX_OWNED_ITEMS});
