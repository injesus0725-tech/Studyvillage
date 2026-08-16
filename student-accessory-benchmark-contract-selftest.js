const assert=require('assert');
const fs=require('fs');
const shop=fs.readFileSync('server/item-shop.js','utf8');
const renderer=fs.readFileSync('avatar-renderer.js','utf8');
const client=fs.readFileSync('student-shop.js','utf8');
const sets=fs.readFileSync('server/item-sets.js','utf8');
const backup=fs.readFileSync('server/star-backup-validator.js','utf8');
const ids=['leaf-cap','scholar-cap','explorer-goggles','star-monocle','field-satchel','book-pack','pet-owl','pet-fox'];

for(const id of ids){
  assert.ok(shop.includes(`'${id}'`),`shop catalog missing ${id}`);
  assert.ok(renderer.includes(`'${id}'`),`avatar renderer missing ${id}`);
  assert.ok(client.includes(`'${id}'`),`student shop preview missing ${id}`);
  assert.ok(backup.includes(`'${id}'`),`backup validator missing ${id}`);
}
for(const token of ['forest-explorer-set','starlight-scholar-set','숲 탐험가 세트','별빛 학자 세트'])assert.ok(sets.includes(token),`accessory set registry missing ${token}`);
for(const slot of ["'leaf-cap':'hat'","'explorer-goggles':'glasses'","'field-satchel':'bag'","'pet-fox':'pet'"])assert.ok(shop.includes(slot),`accessory slot contract missing ${slot}`);
console.log('student accessory benchmark contract selftest passed');
