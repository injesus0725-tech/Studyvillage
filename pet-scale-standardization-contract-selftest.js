const assert=require('assert');
const fs=require('fs');

const shared=fs.readFileSync('avatar-assets.css','utf8');
const production=fs.readFileSync('assets/avatar-production-contract-v2.css','utf8');
const index=fs.readFileSync('index.html','utf8');
const admin=fs.readFileSync('admin.html','utf8');

for(const css of [shared,production]){
  assert.ok(css.includes('--sv-pet-scale: 1.25')||css.includes('--sv-pet-scale:1.25'),'all pet surfaces must use the same 125% scale');
  assert.ok(css.includes('scale(var(--sv-pet-scale))'),'pet artwork must consume the shared scale token');
  assert.ok(css.includes('transform-origin: center bottom')||css.includes('transform-origin:center bottom'),'pet scaling must preserve the common ground line');
  assert.ok(css.includes('[data-avatar-item^="pet-"]>svg')||css.includes('[data-avatar-item^="pet-"] svg'),'legacy SVG pets and production PNG pets must follow the same rule');
}

assert.ok(index.includes('avatar-assets.css?v=20260914petscale1'),'student runtime must invalidate the cached shared pet rule');
assert.ok(index.includes('avatar-production-contract-v2.css?v=20260914petscale1'),'student runtime must invalidate the cached production pet rule');
assert.ok(admin.includes('avatar-assets.css?v=20260914petscale1'),'admin preview must invalidate the cached shared pet rule');

console.log('pet scale standardization contract self-test passed');
