@echo off
title SmartNotes Frontend (React + Vite)
echo ====================================================
echo Starting SmartNotes Frontend Dev Server (Port 5173)...
echo ====================================================
cd /d "%~dp0frontend"
call npm.cmd run dev
pause
