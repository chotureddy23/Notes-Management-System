@echo off
title SmartNotes Public Cloudflare Tunnel (Port 5000)
echo ====================================================================
echo Starting SmartNotes Public Tunnel for Postman Cloud Agent / Remote...
echo ====================================================================
echo Exposing local port 5000 to public HTTPS...
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://127.0.0.1:5000
pause
