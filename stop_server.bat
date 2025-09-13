@echo off
chcp 65001 >nul
title Trading Signals - Остановка сервера

echo.
echo ========================================
echo    Trading Signals - Остановка сервера
echo ========================================
echo.

echo 🛑 Останавливаем сервер...

:: Ищем процессы Node.js
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ Найдены процессы Node.js
    echo 🔄 Завершаем процессы...
    taskkill /F /IM node.exe >nul 2>&1
    echo ✅ Сервер остановлен!
) else (
    echo ℹ️  Процессы Node.js не найдены
)

echo.
echo 👋 Сервер остановлен. До свидания!
timeout /t 3 /nobreak >nul
