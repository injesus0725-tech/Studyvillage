const fs=require('fs');
const assert=require('assert');
const auth=fs.readFileSync('auth.js','utf8');
const session=fs.readFileSync('student-session.js','utf8');

for(const token of [
  'sessionGeneration=0',
  'sessionGeneration++',
  'const expectedToken=sessionToken,expectedName=sessionName,expectedGeneration=sessionGeneration',
  'expectedGeneration!==sessionGeneration||expectedToken!==sessionToken||expectedName!==sessionName',
  'restoredPlayer=null',
  "window.dispatchEvent(new CustomEvent('studyvillage:session-cleared'))"
]) assert.ok(auth.includes(token),`auth.js missing stale-session guard: ${token}`);

assert.ok(session.includes('await window.StudyVillageAuth.logoutSession();'),'student switch must revoke and clear the active session');
assert.ok(session.includes('location.reload();'),'student switch must reload after clearing the active session');

console.log('student session generation contract self-test passed');
