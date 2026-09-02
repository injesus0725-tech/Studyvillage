const assert=require('assert');
const fs=require('fs');
const path=require('path');

const root=__dirname;
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/avatar-rpg/manifest.json'),'utf8'));
const files=[
  ...Object.values(manifest.internalBases||{}),
  ...Object.values(manifest.defaultHair||{}),
  manifest.alignmentProof?.boyHairPreview,
  manifest.alignmentProof?.girlHairPreview,
  manifest.alignmentProof?.boyHairSwapPreview,
  manifest.alignmentProof?.girlHairSwapPreview
].filter(Boolean);

assert.strictEqual(manifest.rules?.hairIsIndependentLayer,true,'hair must be an independent layer');
assert.strictEqual(manifest.rules?.defaultHairAlwaysAutoEquipped,true,'a default hair layer must be auto-equipped');
assert.strictEqual(manifest.rules?.hairlessBaseNeverShownAlone,true,'internal hairless bases must never be user-visible alone');
assert.strictEqual(new Set(files).size,files.length,'every modular proof asset should have a distinct file');
for(const file of files){
  const full=path.join(root,'assets/avatar-rpg',file);
  assert.ok(fs.existsSync(full),`${file} must exist`);
  assert.ok(fs.statSync(full).size>10_000,`${file} must be a real production raster asset`);
}
console.log('avatar RPG hair alignment contract passed');
