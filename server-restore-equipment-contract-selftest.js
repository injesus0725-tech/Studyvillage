const fs=require('fs');
const assert=require('assert');

const server=fs.readFileSync('server/server.js','utf8');
const validator=fs.readFileSync('server/backup-validator.js','utf8');
const migrator=fs.readFileSync('server/backup-migrator.js','utf8');

assert.match(server,/equipment_json/,'server must persist player equipment');
assert.match(validator,/equipment_json/,'backup validator must validate player equipment');
assert.match(migrator,/equipment_json/,'backup migration must preserve player equipment');

// A restore implementation must not silently rebuild players while omitting equipment.
const playerWrites=[...server.matchAll(/INSERT\s+INTO\s+players\s*\(([^)]*)\)/gi)].map(m=>m[1]);
assert.ok(playerWrites.length>0,'server must contain a player insert path');
for(const columns of playerWrites){
  if(/password_hash/i.test(columns)&&/base_character/i.test(columns)){
    assert.match(columns,/equipment_json/i,'player restore/create write with character data must include equipment_json');
  }
}

console.log('server restore equipment contract: ok');
