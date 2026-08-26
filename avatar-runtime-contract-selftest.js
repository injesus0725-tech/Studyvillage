const assert=require('assert');
const fs=require('fs');
const path=require('path');

const root=__dirname;
const sourceDir=path.join(root,'assets/avatar-rpg');
const runtimeDir=path.join(root,'assets/avatar-runtime');
const renderer=fs.readFileSync(path.join(root,'avatar-renderer.js'),'utf8');
const names=[...new Set([...renderer.matchAll(/([a-z0-9-]+\.png)/g)].map(match=>match[1]))].sort();
const developmentOnly=name=>/^proof-|reference/i.test(name);
const pngSize=file=>{const data=fs.readFileSync(file);assert.equal(data.toString('ascii',1,4),'PNG',`${file} must be PNG`);return{width:data.readUInt32BE(16),height:data.readUInt32BE(20)}};

assert.ok(renderer.includes("const RPG='/assets/avatar-runtime/'"),'live renderer must use optimized runtime assets');
assert.ok(names.every(name=>!developmentOnly(name)),'live renderer must never reference proof/reference images');
const catalog=JSON.parse(fs.readFileSync(path.join(runtimeDir,'catalog.json'),'utf8'));
assert.deepStrictEqual(catalog.canvas,{width:256,height:256},'runtime canvas must match the small on-screen avatar target');
assert.deepStrictEqual(catalog.files,names,'runtime catalog must include every live raster asset');
const runtimePngs=fs.readdirSync(runtimeDir).filter(name=>name.endsWith('.png')).sort();
assert.deepStrictEqual(runtimePngs,names,'runtime directory must contain only live raster assets');
let sourceBytes=0,runtimeBytes=0;
for(const name of names){
  const source=path.join(sourceDir,name),runtime=path.join(runtimeDir,name);
  assert.ok(fs.existsSync(source),`${name} source master missing`);
  assert.ok(fs.existsSync(runtime),`${name} optimized runtime asset missing`);
  assert.deepStrictEqual(pngSize(runtime),{width:256,height:256},`${name} must be a 256px runtime canvas`);
  sourceBytes+=fs.statSync(source).size;
  runtimeBytes+=fs.statSync(runtime).size;
}
assert.ok(runtimeBytes<sourceBytes,`runtime avatar bundle must be smaller (${runtimeBytes} < ${sourceBytes})`);
console.log(`avatar runtime contract passed: ${names.length} clean files at ${Math.round(runtimeBytes/sourceBytes*100)}% of master bytes`);
