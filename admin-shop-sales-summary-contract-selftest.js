const fs=require('fs');
const assert=require('assert');
const server=fs.readFileSync('server/item-shop.js','utf8');
const admin=fs.readFileSync('admin-shop.js','utf8');

const summary=server.slice(server.indexOf('export function adminShopState'),server.indexOf('export function playerShopState'));
assert.ok(summary.includes("WHERE kind IN ('item-purchase','physical-item-purchase')"),'디지털·실물 상점 구매 장부만 판매 집계에 포함해야 합니다.');
assert.ok(summary.includes('COUNT(DISTINCT player_name) AS buyers'),'아이템별 구매 학생 수를 중복 없이 집계해야 합니다.');
assert.ok(summary.includes('CASE WHEN delta<0 THEN -delta ELSE 0 END'),'실제 차감된 별만 양수 합계로 계산해야 합니다.');
assert.ok(summary.includes("if(!(id in DEFAULT_PRICES))continue"),'알 수 없는 장부 참조는 통계에서 제외해야 합니다.');
assert.ok(server.includes("res.json({ok:true,...adminShopState()})"),'관리자 인증 상점 API만 판매 통계를 반환해야 합니다.');
const studentState=server.slice(server.indexOf('export function shopState'),server.indexOf('export function adminShopState'));
assert.ok(!studentState.includes('buyers')&&!studentState.includes('starsSpent'),'학생 상점 상태에는 학급 구매 통계를 포함하지 않아야 합니다.');
assert.ok(admin.includes('data-shop-sales-summary'),'관리자 아이템 카드에 판매 통계 영역이 있어야 합니다.');
assert.ok(admin.includes('Number(item.buyers)')&&admin.includes('Number(item.starsSpent)'),'누락·오염된 통계는 0으로 안전하게 표시해야 합니다.');
console.log('admin shop sales summary contract self-test passed');
