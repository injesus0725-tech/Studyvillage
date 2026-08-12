const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('admin-live-events.js','utf8');

assert.ok(src.includes('RESEND_GUARD_MS=2000'),'교사 방송은 연속 전송 방지 시간을 유지해야 합니다.');
assert.ok(src.includes('if(sending||now-lastSentAt<RESEND_GUARD_MS)'),'전송 중이거나 너무 빠른 재전송은 막아야 합니다.');
assert.ok(src.includes('send.disabled=sending||!text'),'전송 중에는 방송 보내기 버튼을 비활성화해야 합니다.');
assert.ok(src.includes("DRAFT_KEY='studyvillage-admin-live-draft:v1'"),'작성 중 방송 문구는 임시 보관되어야 합니다.');
assert.ok(src.includes('sessionStorage.setItem(DRAFT_KEY,text)'),'방송 초안을 브라우저 세션에 보관해야 합니다.');
assert.ok(src.includes('if(clearDraftOnSuccess&&d.recipients>0)clearDraft()'),'실제 전송 성공 후에만 초안을 지워야 합니다.');
assert.ok(src.includes("if(e.key==='Enter'&&!e.isComposing)"),'한글 입력 조합 중 Enter로 잘못 전송되면 안 됩니다.');
assert.ok(src.includes('confirmSend&&!confirm(`현재 접속한 학생들에게 방송을 보낼까요?'),'실제 교사 방송은 전송 전에 내용을 확인해야 합니다.');
assert.ok(src.includes('clearDraftOnSuccess:true,confirmSend:true'),'버튼과 Enter 전송 모두 확인 절차를 사용해야 합니다.');

console.log('admin live events send safety contract self-test passed');
