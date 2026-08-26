const fs=require('fs');
const path=require('path');
const {execFileSync}=require('child_process');

const root=__dirname;
const sourceDir=path.join(root,'assets/avatar-rpg');
const runtimeDir=path.join(root,'assets/avatar-runtime');
const renderer=fs.readFileSync(path.join(root,'avatar-renderer.js'),'utf8');
const names=[...new Set([...renderer.matchAll(/([a-z0-9-]+\.png)/g)].map(match=>match[1]))].sort();

if(!names.length)throw new Error('No avatar PNG assets were found in avatar-renderer.js');
fs.mkdirSync(runtimeDir,{recursive:true});

let sourceBytes=0;
let runtimeBytes=0;
for(const name of names){
  const source=path.join(sourceDir,name);
  const output=path.join(runtimeDir,name);
  if(!fs.existsSync(source))throw new Error(`Missing avatar master: ${name}`);
  execFileSync('convert',[source,'-resize','256x256!','-strip','-define','png:compression-level=9',output],{stdio:'inherit'});
  sourceBytes+=fs.statSync(source).size;
  runtimeBytes+=fs.statSync(output).size;
}

const catalog={version:1,canvas:{width:256,height:256},generatedFrom:'assets/avatar-rpg',files:names};
fs.writeFileSync(path.join(runtimeDir,'catalog.json'),`${JSON.stringify(catalog,null,2)}\n`);
console.log(`avatar runtime: ${names.length} files, ${sourceBytes} -> ${runtimeBytes} bytes (${Math.round(runtimeBytes/sourceBytes*100)}%)`);
