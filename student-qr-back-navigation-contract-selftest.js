const fs=require('fs'),assert=require('assert'),src=fs.readFileSync('student-session.js','utf8');
assert.ok(src.includes('new MutationObserver(()=>{const now=active();if(now&&!wasActive)armNavigation(true)')&&src.includes('armNavigation();'),'back protection must start on the QR login screen and be re-armed after entering the game');
assert.ok(src.includes('function armNavigation(force=false){if(navigationArmed&&!force)return;'),'login-screen protection must not depend on the game already being active, while game entry can force a fresh guard');
const pop=src.slice(src.indexOf("window.addEventListener('popstate'"),src.indexOf('new MutationObserver'));
assert.ok(pop.includes('if(leaving)return')&&!pop.includes('!active()'),'back must stay inside the app before and after login unless explicit exit is underway');
assert.ok(pop.includes('if(active())window.dispatchEvent(new KeyboardEvent'),'only an active game should translate back into internal Escape navigation');
assert.ok(!/logoutSession|location\.reload/.test(pop),'hardware back must never log out or reload the student app');
assert.ok(src.includes('🚪 나가기 또는 멀티태스킹 닫기'),'the protected login screen must explain the intentional exit methods');
console.log('student QR back navigation contract self-test passed');
