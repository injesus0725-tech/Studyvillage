/* v0.9.94 Studyvillage wardrobe DB adapter.
   Keeps permanent ownership separate from currently equipped items. */
import { addOwnedItem, parseOwnedItems, serializeOwnedItems } from './item-ownership.js';

export function installWardrobeStorage(db){
  const columns=db.prepare('PRAGMA table_info(players)').all().map(r=>r.name);
  if(!columns.includes('owned_items_json'))db.exec(`ALTER TABLE players ADD COLUMN owned_items_json TEXT NOT NULL DEFAULT '[]'`);

  const read=db.prepare('SELECT owned_items_json FROM players WHERE name=?');
  const write=db.prepare('UPDATE players SET owned_items_json=?,updated_at=? WHERE name=?');

  function getOwnedItems(name){return parseOwnedItems(read.get(name)?.owned_items_json||'[]')}
  function grantItem(name,itemId){
    const row=read.get(name);if(!row)return{ok:false,code:'player-not-found',items:[]};
    const result=addOwnedItem(row.owned_items_json,itemId);if(!result.ok)return result;
    if(!result.alreadyOwned)write.run(serializeOwnedItems(result.items),new Date().toISOString(),name);
    return result;
  }
  function replaceOwnedItems(name,items){const value=serializeOwnedItems(items);const changed=write.run(value,new Date().toISOString(),name).changes;return{ok:changed>0,items:parseOwnedItems(value)}}
  return{getOwnedItems,grantItem,replaceOwnedItems};
}
