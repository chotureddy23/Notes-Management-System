@echo off
title SmartNotes — Restart Backend
echo ====================================================
echo Restarting SmartNotes Backend Server (Port 5000)...
echo ====================================================

powershell -Command "$p5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue; if ($p5000) { Stop-Process -Id $p5000.OwningProcess -Force; Write-Host '[OK] Stopped previous Backend process (PID ' $p5000.OwningProcess ')' }"

timeout /t 1 /nobreak >nul

echo Starting Backend Server on http://0.0.0.0:5000...
cd /d "%~dp0backend"
node server.js
pause
