const fs=require('fs'),assert=require('assert');
const sync=fs.readFileSync('student-result-profile-sync.js','utf8');
const math=fs.readFileSync('math-practice.js','utf8');
const library=fs.readFileSync('library-game.js','utf8');

assert.ok(math.includes("window.dispatchEvent(new Event('studyvillage:activity-record-refresh'))"),'math completion must announce its confirmed activity save');
assert.ok(sync.includes("window.addEventListener('studyvillage:activity-record-refresh',refreshConfirmedPlayer)"),'confirmed math saves must refresh the visible player profile');
assert.ok(sync.includes("fetch('/api/player/me'")&&sync.includes("cache:'no-store'"),'profile refresh must read the latest server-confirmed player state');
assert.ok(sync.includes('if(profileRefresh)return profileRefresh'),'rapid completion refreshes must share one player request');
assert.ok(sync.includes('setTimeout(()=>controller.abort(),5000)'),'profile refresh must not wait forever');
assert.ok(library.includes("studyvillage:library-complete")&&sync.includes("window.dispatchEvent(new Event('studyvillage:ranking-refresh'))"),'math and vocabulary completion must both refresh ranking-dependent level state');
assert.ok(sync.includes('else refreshConfirmedPlayer();'),'vocabulary completion must fetch the confirmed player when the save response omits it');
console.log('student activity result profile sync contract self-test passed');
