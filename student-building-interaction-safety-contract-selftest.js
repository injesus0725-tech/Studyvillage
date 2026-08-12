const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('building-interiors.js','utf8');
assert.ok(src.includes("const active=game.classList.contains('active')&&!document.hidden"),'건물 거리 계산은 실제 게임 화면이 보일 때만 해야 합니다.');
assert.ok(src.includes('if(active&&!open){const b=nearest()'),'건물 안내 계산은 활성 게임 화면에서만 수행해야 합니다.');
assert.ok(src.includes('⭐ 별로 아이템을 사고'),'꾸미기 상점 안내는 현재 별 상점 흐름을 설명해야 합니다.');
console.log('student building interaction safety contract self-test passed');
