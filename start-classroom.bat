@echo off
chcp 65001 > nul
setlocal
cd /d "%~dp0server"

echo =============================================
echo       Studyvillage 교실 서버 시작
 echo =============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [오류] Node.js가 설치되어 있지 않습니다.
  echo Node.js를 설치한 뒤 다시 실행해 주세요.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo 처음 실행입니다. 필요한 구성 요소를 설치합니다...
  call npm install
  if errorlevel 1 (
    echo.
    echo [오류] 구성 요소 설치에 실패했습니다.
    pause
    exit /b 1
  )
)

echo.
echo 서버를 시작합니다.
echo 잠시 후 학생 접속 QR 화면이 자동으로 열립니다.
echo 종료하려면 이 창에서 Ctrl+C를 누르세요.
echo.

start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000/connect.html"
call npm start
pause
