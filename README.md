# 🌳 우리 학습마을 (Studyvillage)

교실에서 사용할 수 있는 학습 RPG 프로젝트입니다.

## 현재 버전

**v0.5.0 — Portable EXE Packaging Foundation**

기본 운영 구조는 **교실 선생님 컴퓨터 = 서버**입니다.

- Electron 기반 교사용 실행기
- 앱 실행 시 Express + SQLite 서버 자동 시작
- 학생 이름 + 비밀번호 로그인
- 학생 기록을 선생님 PC의 SQLite DB에 저장
- 교사용 관리자 인증 및 학생 계정 관리
- 유선/Wi-Fi 어댑터별 QR 자동 생성
- 관리자 백업/복원
- Windows portable EXE 빌드 설정
- GitHub Actions 자동 Windows 빌드 워크플로

## 독립 실행형 목표

최종 사용 흐름은 다음과 같습니다.

1. `Studyvillage.exe` 더블클릭
2. 교실 서버 자동 시작
3. QR 화면 자동 표시
4. 학생은 태블릿으로 같은 네트워크의 QR 스캔
5. 이름 + 비밀번호로 입장
6. 학생 기록은 교사용 PC에 저장

Electron 패키지 내부는 읽기 전용이 될 수 있으므로 실제 SQLite 데이터는 Windows의 사용자 데이터 폴더 아래 별도 `data/studyvillage.db`에 저장하도록 변경했습니다. 따라서 프로그램을 새 버전으로 교체해도 기존 데이터 파일을 분리해서 유지할 수 있는 구조입니다.

## Windows 빌드

루트 `package.json`에 Electron 및 electron-builder 설정이 있습니다.

개발 환경에서는:

`npm install`

`npm start`

Windows portable EXE 생성:

`npm run dist:win`

또한 `.github/workflows/build-windows.yml`이 있어 GitHub Actions에서 Windows EXE를 자동 빌드할 수 있도록 준비했습니다.

## 기존 개발용 실행

Node.js가 설치된 PC에서는 기존 `start-classroom.bat` 방식도 계속 사용할 수 있습니다.

## 데이터와 백업

관리자 화면에서 백업 JSON을 내려받고 새 PC에서 복원할 수 있습니다. 백업 파일에는 학생 계정 인증 정보와 기록이 포함되므로 교사용 안전한 저장 공간에 보관하세요.

## 다음 개발 예정

- v0.5.1: GitHub Actions 실제 Windows 빌드 검증 및 오류 수정
- v0.5.2: portable EXE 실행 흐름 검증
- 이후: 참여 기록 확장, 학습 보상, 실제 교실 테스트 개선
