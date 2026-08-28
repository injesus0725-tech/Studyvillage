const fs=require('fs'),assert=require('assert');
const server=fs.readFileSync('server/server.js','utf8'),game=fs.readFileSync('game.js','utf8'),admin=fs.readFileSync('admin-network-guard.js','utf8'),pkg=JSON.parse(fs.readFileSync('package.json','utf8')),student=fs.readFileSync('question-response.js','utf8'),adminPage=fs.readFileSync('admin.html','utf8');
assert.ok(server.includes("const BUILD_ID='20260828-r11-whole-characters'"),'the packaged classroom server must expose an unmistakable build id');
for(const token of ["'Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate'","express.static(rootDir,{etag:false,lastModified:false})","buildId:BUILD_ID","'X-StudyVillage-Build',BUILD_ID"])assert.ok(server.includes(token),`stale classroom assets must be disabled: ${token}`);
assert.ok(game.includes(`replaceChildren('StudyVillage v${pkg.version}')`),'student login screen must show the packaged release version');
assert.ok(admin.includes("marker.textContent='입력초점 R8 · 20260825'"),'teacher screen must show the unique recovery build marker');
assert.ok(pkg.build.files.includes('assets/**/*'),'portable build must include runtime supplemental assets');
for(const asset of ['curriculum-content-supplement.js','bookmaru-variety-supplement.js','math-curriculum-supplement.js']){
 assert.ok(student.includes(`assets/${asset}?v=20260828v1`),`student supplemental asset needs a cache-versioned path: ${asset}`);
 if(asset!=='curriculum-content-supplement.js')assert.ok(adminPage.includes(`assets/${asset}?v=20260828v1`),`admin supplemental asset needs a cache-versioned path: ${asset}`);
}
assert.ok(student.includes('assets/social-science-curriculum-supplement.js?v=20260828v1'),'student social/science supplement needs a cache-versioned path');
console.log('classroom cache bust and visible build contract self-test passed');
