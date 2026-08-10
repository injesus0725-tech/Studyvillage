# 🌳 우리 학습마을 (Studyvillage)

교실에서 사용할 수 있는 학습 RPG 프로젝트입니다.

## 현재 버전

**v0.4.3 — Classroom QR Connect**

기본 운영 구조는 **교실 선생님 컴퓨터 = 서버**입니다.

- Node + SQLite 교실 서버
- 학생 이름 + 비밀번호 로그인
- 학생 기록을 선생님 PC의 SQLite DB에 저장
- 로그인 세션 토큰으로 자기 기록만 수정 가능
- 교사용 관리자/랭킹 화면
- 학생 접속 주소 자동 탐색
- 유선/Wi-Fi 등 네트워크 어댑터별 접속 주소 표시
- 학생 접속용 QR 자동 생성
- 주소 복사 버튼

## 실행 파일

- `start-classroom.bat`: Windows에서 교실 서버 시작
- `server/server.js`: Express + SQLite 서버
- `server/package.json`: 서버 의존성
- `server/studyvillage.db`: 첫 서버 실행 시 자동 생성되는 학생 데이터 파일

## 주요 화면

- `http://localhost:3000/connect.html` : 학생 접속 주소 + QR 화면
- `http://localhost:3000/admin.html` : 교사용 관리자/랭킹 화면
- `http://localhost:3000/` : 학생 게임 화면

유선과 Wi-Fi가 동시에 연결된 PC에서는 QR이 여러 개 표시될 수 있습니다. 학생 태블릿과 같은 네트워크 어댑터의 주소를 사용하면 됩니다.

## 첫 실행

현재 단계부터 Node.js가 설치된 Windows 컴퓨터에서는 실행 테스트가 가능합니다.

1. 저장소 전체를 컴퓨터에 내려받습니다.
2. 루트 폴더의 `start-classroom.bat`을 더블클릭합니다.
3. 처음 한 번은 필요한 서버 구성 요소를 자동 설치합니다.
4. 서버 창에 학생용 내부 네트워크 주소가 표시됩니다.
5. 선생님 PC에서 `http://localhost:3000/connect.html`을 열면 QR을 확인할 수 있습니다.

아직 Node.js 없이 바로 켜지는 독립형 `.exe` 패키지는 아닙니다.

## 데이터 저장 위치

학생 계정과 게임 기록은 기본적으로 다음 파일에 저장됩니다.

`server/studyvillage.db`

이 파일을 백업하면 학생 기록도 함께 백업할 수 있습니다.

## 다음 개발 예정

- v0.4.4: 교사용 관리자 인증과 학생 계정 관리
- v0.4.5: 백업/복원 기능
- 이후: Node.js 설치가 필요 없는 교실용 실행 프로그램 패키징, 학습 보상, 참여 기록 확장
