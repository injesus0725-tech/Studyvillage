# 🌳 우리 학습마을 (Studyvillage)

교실에서 사용할 수 있는 학습 RPG 프로젝트입니다.

## 현재 버전

**v0.3.2 — Firebase Cloud Adapter**

- 이름 + 비밀번호 로그인 구조 유지
- Firebase Authentication 연결 어댑터 추가
- Cloud Firestore 플레이어 기록 어댑터 추가
- Firebase가 비활성화되어 있으면 기존 로컬 저장으로 자동 대체
- 사용자 UID 기준 Firestore 보안 규칙 추가
- Firebase 프로젝트별 설정 파일 분리
- 수수께끼 10문제 / 개인 기록판 / 이동 / NPC 기능 유지

## Firebase 파일

- `firebase-config.js`: 현재 비활성 상태의 프로젝트 설정 자리
- `firebase-config.example.js`: 설정 예시
- `firebase-service.js`: Authentication + Firestore 어댑터
- `firestore.rules`: 로그인한 사용자가 자기 기록만 읽고 쓰도록 제한

Firebase 프로젝트를 만든 뒤 웹 앱 설정값을 `firebase-config.js`에 넣고 `enabled: true`로 바꾸면 클라우드 모드를 활성화할 수 있도록 준비되어 있습니다.

## 기록 구조

- `totalScore`: 누적 점수
- `attempts`: 퀴즈 완료 횟수
- `bestScore`: 최고 점수
- `lastScore`: 최근 점수
- `updatedAt`: 마지막 기록 시각

## 실행 상태

현재 저장소에는 클라우드 연결 코드까지 준비되어 있지만, 실제 Firebase 프로젝트 설정값은 아직 입력하지 않았습니다. 따라서 지금은 로컬 모드로 동작합니다. 실제 배포/접속 경로가 확보되는 순간 별도로 안내합니다.

## 다음 개발 예정

- v0.3.3: Firebase 프로젝트 연결 후 여러 기기 공용 계정/기록
- 이후: QR 접속, 실시간 순위, 교사용 관리 기능, 학습 보상
