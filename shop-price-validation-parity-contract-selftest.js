const fs=require('fs');
const assert=require('assert');

const admin=fs.readFileSync('admin-shop.js','utf8');
const server=fs.readFileSync('server/item-shop.js','utf8');

assert.ok(
  admin.includes('!Number.isInteger(value)||value<0||value>100000'),
  '관리자 화면은 가격을 0~100000 사이 정수로 제한해야 합니다.'
);
assert.ok(
  server.includes("!Number.isInteger(value)||value<0||value>100000"),
  '서버도 가격을 0~100000 사이 정수로 제한해야 합니다.'
);
assert.ok(
  server.includes("code:'invalid-price'"),
  '서버는 잘못된 가격을 명시적으로 거부해야 합니다.'
);

console.log('shop price validation parity contract self-test passed');
