@echo off
title "SmartNotes Backend"
echo ====================================================
echo Checking SmartNotes Backend API Server (Port 5000)...
echo ====================================================

netstat -ano | findstr /R ":5000 " | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo.
    echo [NOTICE] SmartNotes backend is ALREADY running on port 5000.
    echo An active backend process is already serving requests on http://localhost:5000
    echo You should use the existing process instead of starting a second server.
    echo.
    echo If you want to force restart it, run "restart-backend.bat" or "stop-all.bat".
    echo.
    pause
    exit /b 0
)

cd /d "%~dp0backend"
node server.js
pause
