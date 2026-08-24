const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),game=fs.readFileSync('game.js','utf8'),admin=fs.readFileSync('admin-network-guard.js','utf8');
assert.ok(server.includes("const BUILD_ID='20260824-r3-observer-loop-fix'"),'the packaged classroom server must expose an unmistakable build id');
for(const token of ["'Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate'","express.static(rootDir,{etag:false,lastModified:false})","buildId:BUILD_ID","'X-StudyVillage-Build',BUILD_ID"])assert.ok(server.includes(token),`stale classroom assets must be disabled: ${token}`);
assert.ok(game.includes("replaceChildren('복구빌드 R3 · 20260824')"),'student login screen must show the unique recovery build marker');
assert.ok(admin.includes("marker.textContent='복구빌드 R3 · 20260824'"),'teacher screen must show the unique recovery build marker');
console.log('classroom cache bust and visible build contract self-test passed');
