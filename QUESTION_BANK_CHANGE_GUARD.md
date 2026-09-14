# 문제은행 전용 작업 보호 규칙

고정 문제 추가 전용 브랜치에서는 `question-data.js`와 `curriculum-question-bank.js`만 수정할 수 있습니다.

검사 명령:

```bash
git fetch origin
node scripts/question-bank-change-guard.js origin/stabilize-touch-buildings-20260820
node question-content-selftest.js
node question-metadata-selftest.js
npm run verify
```

첫 번째 검사는 다음 변경을 차단합니다.

- 문제은행 이외 파일 변경
- 기존 문제 수정·삭제·순서 변경
- 기존 단원 추가·삭제 또는 메타데이터 변경
- 중복 문제 ID
- 같은 단원 안의 중복 질문
- 빈 질문·보기·해설
- 중복 보기 또는 범위를 벗어난 정답 번호

검사를 모두 통과하기 전에는 커밋하거나 게시하지 않습니다. 랜덤 문제 생성 코드는 이 전용 작업에서 수정하지 않습니다.
