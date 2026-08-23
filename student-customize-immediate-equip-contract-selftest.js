const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('customize.js','utf8');

assert.ok(/async function saveEquipment\(\{closeAfter=false\}=\{\}\)\s*\{\s*if\(save\.disabled\)return false;/.test(src),'겹친 꾸미기 저장은 성공으로 처리하면 안 됩니다.');
assert.ok(src.includes("message.textContent='캐릭터 모습이 저장됐어요! ✨';window.dispatchEvent(new Event('studyvillage:ranking-refresh'))"),'꾸미기 저장 성공 처리가 필요합니다.');
assert.ok(/if\(closeAfter\)\{panel\.hidden=true;button\.focus\?\.\(\)\}return true/.test(src),'학생이 장착 저장을 누른 경우 저장 성공 뒤 꾸미기 창을 닫아야 합니다.');
assert.ok(/catch\(err\)\{[\s\S]*return false\}finally\{save\.disabled=false\}/.test(src),'꾸미기 저장 실패는 false를 반환하고 버튼 잠금을 풀어야 합니다.');
assert.ok(src.includes('const ok=await saveEquipment()'),'구매 직후 자동 장착은 실제 저장 성공 여부를 확인해야 합니다.');
assert.ok(src.includes("save.addEventListener('click',()=>saveEquipment({closeAfter:true}))"),'직접 장착 저장은 성공 후 꾸미기 창을 닫는 경로를 사용해야 합니다.');
assert.ok(src.includes('구매는 완료됐지만 장착 저장은 다시 시도해 주세요.'),'장착 저장 실패를 성공 문구로 덮어쓰면 안 됩니다.');
assert.ok(src.includes("timedFetch('/api/player/me/equipment'"),'레벨 해금 장비는 학생 장착 API로 저장해야 합니다.');
assert.ok(src.includes("timedFetch('/api/shop/equipment'"),'구매 장비는 상점 장착 API로 저장해야 합니다.');
console.log('student customize immediate equip contract self-test passed');
