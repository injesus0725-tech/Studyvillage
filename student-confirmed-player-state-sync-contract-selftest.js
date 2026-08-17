const fs=require('fs'),assert=require('assert');
const sync=fs.readFileSync('student-result-profile-sync.js','utf8');
const game=fs.readFileSync('game.js','utf8');

assert.ok(sync.includes("new CustomEvent('studyvillage:player-confirmed',{detail:{player}})"),'confirmed profile refreshes must announce the full server player');
assert.ok(game.includes("window.addEventListener('studyvillage:player-confirmed'"),'the game must receive confirmed activity profile updates');
assert.ok(game.includes('applyRecord(confirmed);updateProfile();refreshRecord()'),'confirmed updates must replace internal XP/level state as well as visible HUD text');
assert.ok(game.includes('if(!confirmed||!state.running)return'),'profile events must not initialize game state before student entry');
const resultStart=game.indexOf('async function renderQuizResult');
assert.ok(game.indexOf('oldLevel=state.level',resultStart)>resultStart&&game.indexOf('oldXp=state.xp',resultStart)>resultStart,'riddle deltas must use the now-synchronized internal level and XP baseline');
console.log('student confirmed player state sync contract self-test passed');
