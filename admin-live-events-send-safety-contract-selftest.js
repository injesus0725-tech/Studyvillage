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
assert.ok(src.includes('if(confirmSend&&!confirm(`${confirmationText}'),'실제 교사 방송은 전송 전에 내용을 확인해야 합니다.');
assert.ok(src.includes('clearDraftOnSuccess:true,confirmSend:true'),'버튼과 Enter 전송 모두 확인 절차를 사용해야 합니다.');
assert.ok(src.includes("title=\"현재 접속 중인 학생에게 테스트 알림을 보냅니다.\""),'테스트 버튼이 실제 학생에게 전송됨을 미리 알려야 합니다.');
assert.ok(src.includes("confirmationText:'테스트 알림도 현재 접속한 학생들에게 실제로 전송됩니다. 보내볼까요?'"),'테스트 방송도 실제 전송 전에 확인해야 합니다.');
assert.ok(src.includes('REQUEST_TIMEOUT_MS=5000'),'교사 방송 요청은 무한정 대기하지 않도록 제한 시간이 필요합니다.');
assert.ok(src.includes("err?.name==='AbortError'?'방송 전송 시간이 초과되었습니다. 다시 시도해 주세요.'"),'방송 전송 시간 초과를 일반 연결 실패와 구분해야 합니다.');
assert.ok(src.includes("err?.name==='AbortError'?'접속 인원 확인 시간 초과':'접속 인원 확인 안 됨'"),'방송 대상 인원 확인 시간 초과도 구분해 보여줘야 합니다.');
assert.ok((src.match(/r\.status===401/g)||[]).length>=2,'접속 인원 조회와 방송 전송 모두 관리자 세션 만료를 처리해야 합니다.');
assert.ok(src.includes("alert('관리자 로그인이 만료되었습니다. 다시 로그인해 주세요.')"),'방송 전송 중 세션 만료를 교사에게 명확히 알려야 합니다.');
assert.ok(src.includes('finally{setBusy(false)}'),'세션 만료 후에도 방송 버튼 잠금이 반드시 풀려야 합니다.');

console.log('admin live events send safety contract self-test passed');
