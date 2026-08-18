const fs=require('fs'),assert=require('assert');
const game=fs.readFileSync('game.js','utf8'),guide=fs.readFileSync('onboarding.js','utf8'),server=fs.readFileSync('server/server.js','utf8'),customize=fs.readFileSync('customize.js','utf8');
assert.ok(!guide.includes('data-base="student-girl"')&&!guide.includes('data-base="student-boy"'),'onboarding must not contain a mandatory first-character chooser');
assert.ok(guide.includes('overlay.hidden=true')&&guide.includes("button.addEventListener('click',open)"),'new student login must remain nonblocking and onboarding must be manually opened');
assert.ok(customize.includes('playerData?.baseCharacters')&&customize.includes('renderBases()'),'customization must render the base-character choices supplied by the authenticated player data');
assert.ok(server.includes("BASE_IDS.has(req.body?.baseCharacter)")&&server.includes("UPDATE players SET base_character=?"),'the server must validate and persist base character changes');
assert.ok(game.includes("gameScreen.classList.add('active')")&&game.includes('state.running=true'),'successful login must enter the playable village');
console.log('initial character nonblocking login contract self-test passed');
