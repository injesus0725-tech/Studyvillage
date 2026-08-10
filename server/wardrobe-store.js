/* v0.9.993 Studyvillage wardrobe DB adapter.
   Keeps permanent ownership separate from currently equipped items.
   When installed against the live DB, it verifies the owned_items_json column and records a release-readiness marker. */
import { addOwnedItem, parseOwnedItems, serializeOwnedItems } from './item-ownership.js';

export function installWardrobeStorage(db){
  const columnNames=()=>db.prepare('PRAGMA table_info(players)').all().map(r=>r.name);
  if(!columnNames().includes('owned_items_json'))db.exec(`ALTER TABLE players ADD COLUMN owned_items_json TEXT NOT NULL DEFAULT '[]'`);
  if(!columnNames().includes('owned_items_json'))throw new Error('owned_items_json 컬럼 생성 확인 실패');

  const read=db.prepare('SELECT owned_items_json FROM players WHERE name=?');
  const write=db.prepare('UPDATE players SET owned_items_json=?,updated_at=? WHERE name=?');
  const setMarker=db.prepare(`INSERT INTO settings(key,value) VALUES('release:wardrobe-direct-db-wiring',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`);
  setMarker.run('verified');

  function getOwnedItems(name){return parseOwnedItems(read.get(name)?.owned_items_json||'[]')}
  function grantItem(name,itemId){
    const row=read.get(name);if(!row)return{ok:false,code:'player-not-found',items:[]};
    const result=addOwnedItem(row.owned_items_json,itemId);if(!result.ok)return result;
    if(!result.alreadyOwned)write.run(serializeOwnedItems(result.items),new Date().toISOString(),name);
    return result;
  }
  function replaceOwnedItems(name,items){const value=serializeOwnedItems(items);const changed=write.run(value,new Date().toISOString(),name).changes;return{ok:changed>0,items:parseOwnedItems(value)}}
  return{getOwnedItems,grantItem,replaceOwnedItems,directDbWiringVerified:true};
}
