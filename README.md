# 🌳 우리 학습마을 (Studyvillage)

교실에서 사용할 수 있는 학습 RPG 프로젝트입니다.

## 현재 버전

**v0.4.5 — One-click Classroom Start Flow**

기본 운영 구조는 **교실 선생님 컴퓨터 = 서버**입니다.

- Node + SQLite 교실 서버
- 학생 이름 + 비밀번호 로그인
- 학생 기록을 선생님 PC의 SQLite DB에 저장
- 교사용 관리자 인증 및 학생 계정 관리
- 학생 접속 주소 자동 탐색
- 유선/Wi-Fi 어댑터별 QR 자동 생성
- 서버 실행 후 QR 화면 자동 열기

## 사용 흐름

1. `start-classroom.bat` 더블클릭
2. 서버 자동 시작
3. 잠시 후 `connect.html` 자동 열림
4. 선생님은 QR 화면에서 학생용 주소 확인
5. 학생은 태블릿으로 같은 네트워크의 QR 스캔
6. 이름 + 비밀번호로 입장
7. 교사는 QR 화면에서 `관리자 화면`으로 이동

## 주요 파일

- `start-classroom.bat`: Windows 교실 서버 시작
- `connect.html`: 학생 접속 주소 + QR + 교사용 바로가기
- `admin.html`: 관리자 로그인 및 학생 관리
- `server/server.js`: Express + SQLite 서버
- `server/studyvillage.db`: 첫 실행 시 생성되는 학생 데이터 파일

## 네트워크

유선과 Wi-Fi가 동시에 연결된 PC에서는 QR이 여러 개 표시될 수 있습니다. 학생 태블릿과 같은 네트워크에 연결된 어댑터의 QR을 사용하면 됩니다.

## 실행 상태

현재 **Node.js가 설치된 Windows PC에서는 실행 테스트가 가능한 단계**입니다.

아직 Node.js 설치가 필요 없는 독립형 `.exe`는 아닙니다. 이후 패키징 단계에서 이 의존성까지 없애는 것을 목표로 합니다.

## 데이터 저장 위치

학생 계정과 기록은 다음 파일에 저장됩니다.

`server/studyvillage.db`

이 파일을 백업하면 학생 기록을 함께 보존할 수 있습니다.

## 다음 개발 예정

- v0.4.6: SQLite 백업 / 복원
- 이후: 독립 실행형 패키징, 참여 기록 확장, 학습 보상
