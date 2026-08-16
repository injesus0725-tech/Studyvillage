const fs=require('fs');
const assert=require('assert');
const server=fs.readFileSync('server/item-shop.js','utf8');
const admin=fs.readFileSync('admin-shop.js','utf8');

const summary=server.slice(server.indexOf('export function adminShopState'),server.indexOf('export function playerShopState'));
assert.ok(summary.includes("SELECT owned_items_json FROM players"),'현재 학생 보유 목록을 읽어야 합니다.');
assert.ok(summary.includes('validateOwnedItemsStrict(player.owned_items_json)'),'보유 목록을 엄격히 검증해야 합니다.');
assert.ok(summary.includes('if(!owned.ok)continue'),'한 학생의 손상된 보유 목록이 전체 통계를 막지 않아야 합니다.');
assert.ok(summary.includes('for(const id of new Set(owned.items))'),'한 학생은 아이템별 한 번만 집계해야 합니다.');
assert.ok(summary.includes('if(id in ownershipCounts)ownershipCounts[id]++'),'알려진 상점 아이템만 집계해야 합니다.');
assert.ok(summary.includes('ownedCount:ownershipCounts[item.id]||0'),'아이템별 보유 학생 수를 관리자 응답에 포함해야 합니다.');
const studentState=server.slice(server.indexOf('export function shopState'),server.indexOf('export function adminShopState'));
assert.ok(!studentState.includes('ownershipCounts')&&!studentState.includes('ownedCount'),'학급 보유 통계는 학생 API에 포함하지 않아야 합니다.');
assert.ok(admin.includes('Number(item.ownedCount)'),'관리자 카드에 보유 학생 수를 안전하게 표시해야 합니다.');
console.log('admin shop ownership summary contract self-test passed');
