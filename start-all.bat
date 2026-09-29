@echo off
title SmartNotes — Full MERN Stack Launcher
echo =========================================================
echo    SMARTNOTES — NOTES MANAGEMENT SYSTEM (MERN STACK)
echo =========================================================
echo.

:: 1. Check if backend is already running on port 5000
netstat -ano | findstr /R ":5000 " | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo [OK] Backend server is ALREADY running on http://localhost:5000.
    echo      Reusing the existing active backend process.
) else (
    echo 1. Launching Backend Server on port 5000 (0.0.0.0)...
    start "SmartNotes Backend" cmd /c "cd /d %~dp0backend && node server.js"
    echo Waiting 2 seconds for backend initialization...
    timeout /t 2 /nobreak >nul
)

:: 2. Check if tunnel is already running
tasklist /fi "imagename eq cloudflared.exe" 2>nul | findstr /i "cloudflared.exe" >nul
if %errorlevel% equ 0 (
    echo [OK] Cloudflare Tunnel is ALREADY running.
) else (
    echo 2. Launching Public Cloudflare Tunnel for Postman Cloud Agent / Remote...
    start "SmartNotes Public Tunnel" cmd /c "%~dp0start-tunnel.bat"
)

:: 3. Check if frontend dev server is already running on port 5173
netstat -ano | findstr /R ":5173 " | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo [OK] Frontend server is ALREADY running on http://localhost:5173.
) else (
    echo 3. Launching Frontend on http://localhost:5173...
    start "SmartNotes Frontend" cmd /c "cd /d %~dp0frontend && npm.cmd run dev"
    echo Waiting 2 seconds for frontend server...
    timeout /t 2 /nobreak >nul
)

echo.
echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo.
echo =========================================================
echo Services Status:
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000/api
echo Public Tunnel: Active for Postman / Remote
echo Demo Credentials: demo@smartnotes.com / password123
echo =========================================================
