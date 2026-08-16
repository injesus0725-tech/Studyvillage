const fs=require('fs'),assert=require('assert');
const game=fs.readFileSync('game.js','utf8');
const auth=fs.readFileSync('auth.js','utf8');
const session=fs.readFileSync('student-session.js','utf8');
const restore=fs.readFileSync('session-restore.js','utf8');
const onboarding=fs.readFileSync('onboarding.js','utf8');

assert.ok(game.includes("if(auth.isNew)window.dispatchEvent(new CustomEvent('studyvillage:first-character-choice'"),'only a newly created account may open the first-character choice');
assert.ok(onboarding.includes("window.addEventListener('studyvillage:first-character-choice'"),'the first-character choice must remain connected to successful new-account entry');
assert.ok(session.includes("exitButton.textContent='🚪 나가기'")&&session.includes('await window.StudyVillageAuth.logoutSession();'),'intentional exit must revoke the current student session');
assert.ok(session.indexOf('leaving=true')<session.lastIndexOf('location.reload();'),'intentional exit must release the browser back guard before returning to login');
assert.ok(auth.includes("window.dispatchEvent(new CustomEvent('studyvillage:session-cleared'))"),'clearing a student session must notify every student feature');
for(const token of ['expectedGeneration=sessionGeneration','expectedToken=sessionToken','expectedName=sessionName','expectedGeneration!==sessionGeneration'])assert.ok(auth.includes(token),`late session restoration must be rejected: ${token}`);
assert.ok(restore.includes("title.classList.contains('active')"),'automatic restoration must run only while the login screen is still active');
assert.ok(!/localStorage\.clear|sessionStorage\.clear/.test(session),'leaving or switching students must not erase saved learning progress');
console.log('student entry and intentional exit flow contract self-test passed');
