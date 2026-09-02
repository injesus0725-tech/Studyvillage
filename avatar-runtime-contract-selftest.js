const assert=require('assert');
const fs=require('fs');
const path=require('path');

const root=__dirname;
const runtimeDir=path.join(root,'assets/avatar-runtime');
const renderer=fs.readFileSync(path.join(root,'avatar-renderer.js'),'utf8');
const catalog=JSON.parse(fs.readFileSync(path.join(runtimeDir,'catalog.json'),'utf8'));
const listed=[...catalog.baseCharacters,...catalog.hair,...catalog.outfits,...catalog.pets,...catalog.newArtV2.bases,...catalog.newArtV2.hair,...catalog.newArtV2.outfits,...catalog.newArtV2.pets];
assert.deepStrictEqual(catalog.canvas,{width:256,height:256},'runtime canvas must remain 256x256');
assert.strictEqual(new Set(listed).size,listed.length,'runtime catalog paths must be unique');
for(const rel of listed){
  const file=path.join(runtimeDir,rel),data=fs.readFileSync(file);
  assert.equal(data.toString('ascii',1,4),'PNG',`${rel} must be PNG`);
  assert.equal(data.readUInt32BE(16),256,`${rel} width must be 256`);
  assert.equal(data.readUInt32BE(20),256,`${rel} height must be 256`);
  assert.ok(renderer.includes(path.basename(rel))||catalog.baseCharacters.includes(rel),`live renderer missing ${rel}`);
}
for(const gender of ['boy','girl'])for(let n=2;n<=10;n++)assert.ok(!fs.existsSync(path.join(runtimeDir,`character-${gender}-${String(n).padStart(2,'0')}.png`)),'retired completed character remains');
console.log(`avatar runtime contract passed: ${listed.length} production files at 256x256`);
