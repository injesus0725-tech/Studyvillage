@echo off
chcp 65001 > nul
cd /d "%~dp0"
if not exist node_modules (
  echo [Studyvillage] 첫 실행 준비 중...
  call npm install
  if errorlevel 1 (
    echo.
    echo Node.js 설치 여부를 확인해 주세요.
    pause
    exit /b 1
  )
)
echo.
echo ========================================
echo   우리 학습마을 교실 서버 시작
echo   선생님 컴퓨터: http://localhost:3000
echo ========================================
echo.
call npm start
pause
