const fs=require('fs'),assert=require('assert'),src=fs.readFileSync('student-shop.js','utf8');
assert.ok(src.includes('currentBalance=Math.max(0,Number(data.balance)||0)'),'affordability must use the latest bounded server balance');
assert.ok(src.includes('affordable=currentBalance>=price')&&src.includes('missingStars=Math.max(0,price-currentBalance)'),'the shop must calculate exact affordability and shortage');
assert.ok(src.includes('!affordable?`${price}별 · ${missingStars}별 더 필요`'),'an unaffordable card must explain the exact missing stars');
assert.ok(src.includes('b.disabled=bought||!available||salePending||saleEnded||!levelOk||!affordable||busy'),'unaffordable items must not send avoidable purchase requests');
assert.ok(src.includes("window.addEventListener('studyvillage:stars-refresh',()=>{if(!panel.hidden)load()})"),'an open shop must refresh after a confirmed star reward without loading the closed shop');
assert.ok(src.includes("if(d.code==='insufficient-stars')"),'the server insufficient-balance response must remain authoritative for races and other devices');
console.log('student shop affordability contract self-test passed');
