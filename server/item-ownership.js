/* v0.9.91 lightweight permanent wardrobe ownership helpers.
   Ownership is stored as a compact JSON array of item IDs per player.
   Bought items stay owned even when unequipped; the shop can mark them as owned and the wardrobe can re-equip them later. */

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
export const wardrobeLimits=Object.freeze({maxOwnedItems:MAX_OWNED_ITEMS});
