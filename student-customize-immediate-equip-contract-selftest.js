const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('customize.js','utf8');
assert.ok(src.includes('async function saveEquipment(){if(save.disabled)return false'),'겹친 꾸미기 저장은 성공으로 처리하면 안 됩니다.');
assert.ok(src.includes("message.textContent='캐릭터 모습이 저장됐어요! ✨';window.dispatchEvent(new Event('studyvillage:ranking-refresh'));return true"),'꾸미기 저장 성공 여부를 호출자에게 알려야 합니다.');
assert.ok(src.includes("return false}finally{save.disabled=false}"),'꾸미기 저장 실패는 false를 반환하고 버튼 잠금을 풀어야 합니다.');
assert.ok(src.includes('const saved=await saveEquipment();if(saved)'),'구매 직후 장착은 실제 저장 성공 여부를 확인해야 합니다.');
assert.ok(src.includes('아이템은 구매됐지만 바로 장착하지 못했어요.'),'장착 저장 실패를 성공 문구로 덮어쓰면 안 됩니다.');
console.log('student customize immediate equip contract self-test passed');
