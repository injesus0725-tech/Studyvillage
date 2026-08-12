const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('avatar-motion.js','utf8');
assert.ok(src.includes("document.hidden||!game.classList.contains('active')"),'숨겨진 탭이나 비활성 게임 화면에서는 아바타 위치 계산을 멈춰야 합니다.');
assert.ok(src.includes('getBoundingClientRect()'),'실제 캐릭터 위치 기반 움직임 감지는 유지해야 합니다.');
assert.ok(src.includes("document.addEventListener('visibilitychange'"),'탭이 다시 보이면 움직임 감지를 재개해야 합니다.');
assert.ok(src.includes('MutationObserver'),'게임 화면이 활성화되면 움직임 감지를 재개해야 합니다.');
assert.ok(src.includes('if(!raf)raf=requestAnimationFrame(frame)'),'중복 애니메이션 프레임 예약을 막아야 합니다.');
console.log('avatar motion runtime safety contract self-test passed');
