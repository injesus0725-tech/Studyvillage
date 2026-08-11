const fs=require('fs');
const assert=require('assert');

const main=fs.readFileSync('electron/main.cjs','utf8');

assert.ok(main.includes("app.on('window-all-closed'"),'창을 모두 닫았을 때 종료 처리가 필요합니다.');
assert.ok(main.includes('app.quit();'),'Studyvillage 창을 닫으면 앱이 종료되어야 합니다.');
assert.ok(!/shutdown\s*\(|reboot\s*\(|Restart-Computer|shutdown\.exe/i.test(main),'Studyvillage가 PC 종료/재부팅 명령을 실행하면 안 됩니다.');

console.log('classroom shutdown contract self-test passed');
