const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('server/item-shop.js','utf8');

assert.ok(src.includes("if(!Number.isInteger(value)||value<0||value>100000)return{ok:false,code:'invalid-price',itemId:id}"),'서버는 허용 범위를 벗어난 상점 가격을 저장 전에 거부해야 합니다.');
assert.ok(src.includes('const current=readPrices(db),next={...current}'),'상점 가격 변경은 현재 가격표 사본에서 시작해야 합니다.');
assert.ok(src.includes('const tx=db.transaction(()=>{setSetting(db,PRICE_KEY,JSON.stringify(next));'),'가격표와 상점 사용 여부 저장은 하나의 트랜잭션 안에서 처리되어야 합니다.');
assert.ok(src.includes("if(typeof enabled==='boolean')setSetting(db,ENABLED_KEY,enabled?'true':'false')"),'상점 사용 여부는 명시적인 boolean 값일 때만 변경해야 합니다.');

console.log('item shop price safety contract self-test passed');
