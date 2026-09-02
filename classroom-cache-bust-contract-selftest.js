const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),game=fs.readFileSync('game.js','utf8'),admin=fs.readFileSync('admin-network-guard.js','utf8');
assert.ok(server.includes("const BUILD_ID='20260825-r10-wardrobe'"),'the packaged classroom server must expose an unmistakable build id');
for(const token of ["'Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate'","express.static(rootDir,{etag:false,lastModified:false})","buildId:BUILD_ID","'X-StudyVillage-Build',BUILD_ID"])assert.ok(server.includes(token),`stale classroom assets must be disabled: ${token}`);
assert.ok(game.includes("replaceChildren('꾸미기규격 R10 · 20260825')"),'student login screen must show the unique recovery build marker');
assert.ok(admin.includes("marker.textContent='입력초점 R8 · 20260825'"),'teacher screen must show the unique recovery build marker');
console.log('classroom cache bust and visible build contract self-test passed');
