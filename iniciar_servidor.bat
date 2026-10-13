@echo off
title MATO Platform - Servidor
echo ===================================================
echo     Iniciando Servidor MATO Platform...
echo ===================================================
cd /d "%~dp0"
call npm run dev -- --host --port 5173
pause
