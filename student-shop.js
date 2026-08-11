/* v1.9 student star shop panel. Purchasing is atomic on the server and refreshes star/ownership records. */
(()=>{
  const panel=document.querySelector('#customize-panel');if(!panel)return;
  const icons={'cap-blue':'🧢','crown-gold':'👑','glasses-round':'👓','backpack':'🎒','pet-chick':'🐣','pet-cat':'🐱'};
  const headers=()=>window.StudyVillageAuth?.authHeaders?.()||{};
  const shop=document.createElement('section');shop.className='inventory-group student-shop';shop.innerHTML='<div class="student-shop-head"><h3>⭐ 별 상점</h3><strong id="student-shop-balance">0별</strong></div><p id="student-shop-status" class="record-message">상점 정보를 불러오는 중이에요.</p><div id="student-shop-items" class="inventory-items"></div>';
  const inventory=document.querySelector('#inventory-list');inventory?.before(shop);
  const balance=shop.querySelector('#student-shop-balance'),status=shop.querySelector('#student-shop-status'),list=shop.querySelector('#student-shop-items');
  let busy=false;
  function render(data={}){
    const owned=new Set(Array.isArray(data.ownedItems)?data.ownedItems:[]);balance.textContent=`${Math.max(0,Number(data.balance)||0)}별`;list.innerHTML='';
    if(!data.enabled){status.textContent='지금은 선생님이 상점을 닫아 두었어요.';list.hidden=true;return}
    list.hidden=false;status.textContent='별로 원하는 아이템을 살 수 있어요. 구매 기록은 내 별 장부에 남아요.';
    for(const item of data.items||[]){const bought=owned.has(item.id),b=document.createElement('button');b.type='button';b.className=`inventory-item ${bought?'selected':''}`;b.disabled=bought||busy;b.innerHTML=`<span>${icons[item.id]||'🎁'}</span><strong>${item.name}</strong><small>${bought?'구매 완료':`${Number(item.price)||0}별 · 구매`}</small>`;if(!bought)b.onclick=()=>purchase(item);list.appendChild(b)}
  }
  async function load(){try{const r=await fetch('/api/shop',{headers:headers(),cache:'no-store'}),d=await r.json();if(!r.ok||!d.ok)throw new Error();render(d);return d}catch{status.textContent='상점 정보를 불러오지 못했어요.';return null}}
  async function equipPurchased(itemId){const state=await load();const item=(state?.items||[]).find(x=>x.id===itemId);if(!item)return false;window.dispatchEvent(new CustomEvent('studyvillage:equip-purchased-item',{detail:{itemId,itemName:item.name}}));return true}
  async function purchase(item){if(busy)return;if(!confirm(`${item.name}을(를) ${item.price}별에 살까요?\n구매한 별 사용 기록은 내 별 장부에 남습니다.`))return;busy=true;status.textContent='구매 중…';try{const r=await fetch('/api/shop/purchase',{method:'POST',headers:{'Content-Type':'application/json',...headers()},body:JSON.stringify({itemId:item.id})}),d=await r.json();if(!r.ok||!d.ok){if(d.code==='insufficient-stars')status.textContent=`별이 부족해요. 현재 ${d.balance||0}별이 있어요.`;else if(d.code==='shop-disabled')status.textContent='상점이 방금 닫혔어요.';else if(d.code==='already-owned')status.textContent='이미 가지고 있는 아이템이에요.';else status.textContent='구매하지 못했어요.';return}status.textContent=`🎁 ${d.itemName} 구매 완료! ${d.balance}별이 남았어요.`;window.dispatchEvent(new CustomEvent('studyvillage:shop-purchase',{detail:d}));window.dispatchEvent(new Event('studyvillage:activity-record-refresh'));await load();if(confirm(`${d.itemName} 구매 완료! 🎁\n지금 바로 장착할까요?`))await equipPurchased(d.itemId)}catch{status.textContent='구매 중 연결 문제가 생겼어요.'}finally{busy=false;await load()}}
  document.querySelector('#customize-button')?.addEventListener('click',()=>setTimeout(load,0));window.addEventListener('studyvillage:shop-refresh',load);
})();
