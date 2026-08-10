# 🌳 우리 학습마을 (Studyvillage)

교실에서 사용할 수 있는 학습 RPG 프로젝트입니다.

## 현재 버전

**v0.4.0 — Classroom Server Foundation**

기본 운영 방향을 Firebase 중심에서 **교실 선생님 컴퓨터를 서버로 사용하는 구조**로 변경했습니다.

- 선생님 컴퓨터에서 Node 서버 실행
- SQLite 파일에 학생 계정 및 기록 저장
- 학생 기기는 같은 학교 네트워크에서 선생님 컴퓨터로 접속
- 이름 + 비밀번호 로그인 API
- 비밀번호는 SQLite에 평문 저장하지 않고 `scrypt` 해시 + salt로 저장
- 플레이어 기록 API
- 랭킹 API
- 서버 상태 확인 API
- 서버가 없을 때만 브라우저 localStorage fallback
- Windows용 `server/start-classroom.bat` 실행 스크립트 추가

## 서버 파일

- `server/server.js`: Express + SQLite 교실 서버
- `server/package.json`: 서버 의존성
- `server/start-classroom.bat`: Windows에서 서버 실행
- `server/studyvillage.db`: 첫 서버 실행 시 자동 생성되는 실제 학생 데이터 파일

## 기본 접속 방식

선생님 컴퓨터에서 서버가 실행되면 선생님 PC에서는 다음 주소로 접속합니다.

`http://localhost:3000`

학생들은 같은 교실/학교 네트워크에서 선생님 컴퓨터의 내부 IP 주소와 3000번 포트로 접속하는 구조입니다.

## 현재 진행 상태

서버의 계정/기록/랭킹 API와 프론트엔드 인증·데이터 서비스 라우팅까지 만들어졌습니다.
다음 단계에서는 기존 게임의 점수 저장 흐름을 서버 데이터 서비스에 완전히 연결하고, 실제 실행 테스트가 가능한 패키징 구조를 다듬습니다.

## 다음 개발 예정

- v0.4.1: 게임 기록을 SQLite 서버 저장으로 완전 연결
- v0.4.2: 교사용 관리자/랭킹 화면
- v0.4.3: 학생 QR 접속 주소 표시
- 이후: 교실용 실행 프로그램 패키징, 학습 보상, 참여 기록 확장
