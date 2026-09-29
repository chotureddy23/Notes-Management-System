@echo off
title SmartNotes — Stop All Services
echo ====================================================
echo Stopping SmartNotes Services (Ports 5000, 5173, Tunnel)...
echo ====================================================

powershell -Command "$p5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue; if ($p5000) { Stop-Process -Id $p5000.OwningProcess -Force; Write-Host '[OK] Stopped Backend (Port 5000, PID ' $p5000.OwningProcess ')' } else { Write-Host '[INFO] Port 5000 was not in use.' }"

powershell -Command "$p5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue; if ($p5173) { Stop-Process -Id $p5173.OwningProcess -Force; Write-Host '[OK] Stopped Frontend (Port 5173, PID ' $p5173.OwningProcess ')' } else { Write-Host '[INFO] Port 5173 was not in use.' }"

powershell -Command "Stop-Process -Name 'cloudflared' -Force -ErrorAction SilentlyContinue; Write-Host '[OK] Cloudflare Tunnel stopped (if running).'"

echo.
echo All SmartNotes services stopped successfully.
pause
