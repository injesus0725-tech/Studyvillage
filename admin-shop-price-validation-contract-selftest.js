const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('admin-shop.js','utf8');

assert.ok(src.includes('min="0"'),'상점 가격 입력의 최소값 0을 유지해야 합니다.');
assert.ok(src.includes('max="100000"'),'상점 가격 입력의 최대값 100000을 유지해야 합니다.');
assert.ok(src.includes('step="1"'),'상점 가격 입력은 정수 단위여야 합니다.');
assert.ok(src.includes('Number.isInteger(value)'),'저장 전에 가격이 정수인지 검증해야 합니다.');
assert.ok(src.includes('value<0||value>100000'),'저장 전에 허용 가격 범위를 검증해야 합니다.');
assert.ok(src.includes("return alert('가격은 0~100000 사이의 정수로 입력해 주세요.')"),'잘못된 가격은 저장 요청 전에 차단해야 합니다.');

console.log('admin shop price validation contract self-test passed');
