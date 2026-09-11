# StudyVillage 문제 세트 표준 템플릿

지도안·지도서에서 문제를 대량 추가할 때는 **게임 코드를 고치지 않고 `question-guide-packs.js`의 데이터만 늘리는 것**을 기본 원칙으로 한다. 기존 기본 문제는 `question-data.js`에 그대로 두고, 새 지도안/지도서 문제 팩은 전용 파일에 누적한다.

## 지도안/지도서 문제 팩

실제 지도안·지도서를 첨부받아 만드는 신규 문제는 `question-guide-packs.js`의 `GUIDE_PACKS` 배열에 추가한다. 게임 시작 시 기본 문제은행 뒤에 자동 병합되고, 그 다음 관리자 과목·단원 필터와 교사 문제 수정값이 적용된다.

```js
{
  activityId: 'korean-3-2-unit-1',
  subject: '국어',
  topic: '중심 생각 찾기',
  grade: 3,
  semester: 2,
  unit: '1단원 작품을 보고 느낌을 나누어요',
  subunit: '1~2차시',
  difficulty: 'normal',
  spaces: ['curriculum','exploration'],
  enabled: true,
  questions: [
    {
      id: 'korean-3-2-u1-001',
      question: '문제 문장',
      options: ['보기1', '보기2', '보기3', '보기4'],
      answer: 0,
      explanation: '초등학생이 바로 이해할 수 있는 짧은 정답 설명',
      subunit: '1~2차시',
      difficulty: 'easy',
      spaces: ['curriculum','exploration'],
      enabled: true
    }
  ]
}
```

## 필수 메타데이터

- `activityId`: 영문 소문자·숫자·하이픈만 사용한다. 점수 기록과 연결되므로 한 번 정한 ID는 바꾸지 않는다.
- `subject`: `국어`, `수학`, `사회`, `과학` 등 관리자 과목 필터 기준.
- `grade`: 학년 숫자.
- `semester`: 학기 숫자.
- `unit`: 교과서/지도서의 단원명. **관리자에서 배운 단원만 켜는 기준**이므로 실제 단원명을 일관되게 쓴다.
- `topic` 또는 문제의 `subunit`: 소단원·차시·학습 요소를 구분할 때 사용.
- `difficulty`: `easy`, `normal`, `challenge`, `mixed` 중 상황에 맞게 사용.
- `spaces`: 문제를 사용할 공간. 현재 핵심 값은 `curriculum`, `bookmaru`, `exploration`.
- `enabled`: 기본 출제 가능 여부. 관리자 설정으로 별도 적용/미적용 가능.
- 문제 `id`: 과목·학년·학기·단원과 연결되는 **안정적인 고유 ID**. 문제별 적용/미적용과 교사 수정 기록에 사용하므로 재사용하지 않는다.

## 문제 형식

### 객관식

```js
{
  id:'social-3-2-u2-003',
  question:'우리 고장의 모습을 조사하는 방법으로 알맞은 것은?',
  options:['직접 관찰한다','상상만 한다','아무에게도 묻지 않는다','한 곳만 보고 모두 같다고 한다'],
  answer:0,
  explanation:'직접 관찰, 사진, 면담 등 여러 방법으로 고장의 모습을 조사할 수 있어요.',
  spaces:['curriculum','exploration'],
  enabled:true
}
```

### 직접 입력형

```js
{
  id:'korean-3-2-u1-vocab-004',
  type:'input',
  word:'힘내도록 용기와 힘을 북돋아 주는 것을 무엇이라고 하나요?',
  acceptedAnswers:['격려','격려하다'],
  explanation:'격려는 다른 사람이 힘을 낼 수 있도록 용기와 힘을 북돋아 주는 말이나 행동이에요.',
  spaces:['bookmaru'],
  enabled:true
}
```

## 공간별 원칙

- **교과 배움터 (`curriculum`)**: 교과서·지도서 기반 핵심 개념, 이해, 적용 문제. 교사가 오늘 사용할 과목과 배운 단원을 선택한다.
- **탐험 (`exploration`)**: 배움터와 같은 문제은행을 공유할 수 있다. 관리자에서 탐험 공간의 과목/단원을 별도로 켜거나 끌 수 있다.
- **책마루 (`bookmaru`)**: 국어 지도서의 어려운 낱말, 어휘, 짧은 상식·수수께끼 중심. 한 번에 적게 출제하더라도 관리자에서 켠 단원 안에서 누적 문제은행을 랜덤 사용한다.

## 지도안·지도서 대량 입력 규칙

1. 먼저 파일에서 `과목 → 학년 → 학기 → 단원 → 차시/소단원 → 학습 목표`를 추출한다.
2. 단원마다 객관식/직접입력 문제를 여러 개 만들되, **정답 근거가 지도안·지도서 내용에서 확인되는 문제만** 넣는다.
3. 정답 위치가 한 번호에 몰리지 않도록 보기 순서를 다양화한다. 런타임에서 다시 섞더라도 원본 품질을 유지한다.
4. 모든 오답에는 학생이 왜 틀렸는지 확인할 수 있도록 `explanation`을 넣는 것을 기본으로 한다.
5. 같은 문제를 문장만 조금 바꿔 중복 생산하지 않는다. 개념 확인, 적용, 비교, 자료 해석 등 유형을 섞는다.
6. 문제를 추가할 때 기존 활동 저장·보상·탐험 코드는 수정하지 않는다.
7. 신규 세트는 `question-guide-pack-contract-selftest.js`, `question-metadata-selftest.js`, 문제 감사 검사, 과목·단원 출제 계약 검사를 통과해야 한다.
8. **고유 ID는 한 번 배포한 뒤 바꾸지 않는다.** 문제 순서를 바꾸거나 문제를 중간에 추가해도 기존 문제 ID는 그대로 유지한다.
9. 지도안 근거가 불분명한 상식 문제는 교과 문제로 섞지 않고 책마루/창의적 사고용으로 분리한다.

## 관리자 출제 동작

- `space-subject`: 배움터/탐험에서 오늘 사용할 과목 ON/OFF.
- `space-unit`: 특정 공간에서 특정 단원 적용/미적용.
- `unit`: 모든 공간에서 해당 단원 전체 적용/미적용.
- `question`: 문제 하나만 적용/미적용.
- 학생은 활동에 들어가기 직전에 최신 설정을 다시 받아 다음 출제부터 반영한다.

## ID 권장 규칙

- 세트: `subject-grade-semester-unit` 형태. 예: `science-3-2-unit-2`
- 문제: `subject-grade-semester-uN-###` 형태. 예: `science-3-2-u2-014`
- 어휘: 끝에 `-vocab-###` 사용 가능.

이 규칙을 유지하면 지도안/지도서를 새로 넣을 때 **`question-guide-packs.js`에 문제 데이터만 추가해서 배움터·탐험·책마루 출제 범위를 확장**할 수 있다.
