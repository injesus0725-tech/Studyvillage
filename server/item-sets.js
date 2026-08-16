/* v0.9.90 Studyvillage item set registry foundation.
   Sets are metadata only: existing item ownership/unlock rules remain unchanged.
   This lets future themed sets (teacher, legendary, event sets, etc.) be added without changing individual item IDs. */

const SAFE_ID=/^[a-z0-9-]{1,80}$/;

const SETS=[
  {id:'forest-explorer-set',name:'숲 탐험가 세트',itemIds:['leaf-cap','explorer-goggles','field-satchel','pet-fox'],rarity:'adventure'},
  {id:'starlight-scholar-set',name:'별빛 학자 세트',itemIds:['scholar-cap','star-monocle','book-pack','pet-owl'],rarity:'scholar'}
];

export function validateItemSetRegistry(sets=SETS){
  if(!Array.isArray(sets))return{ok:false,code:'invalid-registry'};
  const setIds=new Set(),claimedItems=new Map();
  for(const set of sets){
    const id=String(set?.id||''),name=String(set?.name||'').trim(),rarity=String(set?.rarity||'standard'),itemIds=set?.itemIds;
    if(!SAFE_ID.test(id)||!name||name.length>80||!SAFE_ID.test(rarity)||!Array.isArray(itemIds)||itemIds.length<1||itemIds.length>20)return{ok:false,code:'invalid-set',setId:id||null};
    if(setIds.has(id))return{ok:false,code:'duplicate-set-id',setId:id};
    setIds.add(id);
    const local=new Set();
    for(const itemId of itemIds){
      const item=String(itemId||'');
      if(!SAFE_ID.test(item)||local.has(item))return{ok:false,code:'invalid-item-id',setId:id,itemId:item||null};
      local.add(item);
      const owner=claimedItems.get(item);
      if(owner&&owner!==id)return{ok:false,code:'item-in-multiple-sets',setId:id,itemId:item,otherSetId:owner};
      claimedItems.set(item,id);
    }
  }
  return{ok:true,setCount:setIds.size,itemCount:claimedItems.size};
}

const registryStatus=validateItemSetRegistry();
if(!registryStatus.ok)console.error('[Studyvillage] item set registry invalid:',registryStatus);

export function getItemSets(){return SETS.map(set=>({...set,itemIds:[...set.itemIds]}))}
export function findItemSetById(id){return SETS.find(set=>set.id===id)||null}
export function findItemSetForItem(itemId){return SETS.find(set=>set.itemIds.includes(itemId))||null}
export const itemSetRegistryStatus=Object.freeze({...registryStatus});
