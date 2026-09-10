const assert=require('assert');
const fs=require('fs');
const path=require('path');

const root=__dirname;
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const files=(pkg.build&&pkg.build.files)||[];

assert.ok(files.includes('assets/**/*'),'packaging must include application assets');
assert.ok(files.includes('!assets/avatar-rpg/**/*'),'avatar master/proof/reference assets must be excluded from distributions');

const runtimeDir=path.join(root,'assets/avatar-runtime');
const sourceDir=path.join(root,'assets/avatar-rpg');
const runtimePngs=fs.readdirSync(runtimeDir).filter(name=>name.endsWith('.png'));
const sourceOnly=fs.readdirSync(sourceDir).filter(name=>/^proof-|reference\.png$|reference/i.test(name));

assert.ok(runtimePngs.length>0,'optimized avatar runtime assets must exist');
assert.ok(sourceOnly.length>0,'source workspace should keep proof/reference images for development validation');
assert.ok(runtimePngs.every(name=>!/^proof-|reference/i.test(name)),'runtime assets must never contain proof/reference images');

console.log(`avatar packaging contract passed: ${runtimePngs.length} runtime PNGs; ${sourceOnly.length} development-only proof/reference images excluded`);
