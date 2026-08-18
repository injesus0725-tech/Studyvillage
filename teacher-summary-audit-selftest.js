const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('admin.html','utf8'),fix=fs.readFileSync('assets/admin-summary-audit-fix.js','utf8');
assert.ok(html.includes('assets/admin-summary-audit-fix.js'),'corrected teacher summary must load');
assert.ok(fix.includes("Array.isArray(player?.activities)"),'summary must use per-activity records');
assert.ok(fix.includes("reduce((sum,row)=>sum+Math.max(0,Number(row?.attempts)||0),0)"),'summary must total all activity attempts');
assert.ok(fix.includes("player?.attempts"),'legacy records must still have a fallback');
assert.ok(fix.includes('책마루·도전관·배움터·탐험'),'teacher tooltip must explain total scope');
console.log('teacher summary audit self-test passed');
