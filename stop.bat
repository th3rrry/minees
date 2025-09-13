@echo off
chcp 65001 >nul
title Trading Signals - Остановка

echo.
echo ========================================
echo    Trading Signals - Остановка системы
echo ========================================
echo.

echo 🛑 Останавливаем все процессы...

:: Останавливаем процессы Node.js
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ Найдены процессы Node.js
    echo 🔄 Завершаем процессы...
    taskkill /F /IM node.exe >nul 2>&1
    echo ✅ Процессы Node.js остановлены!
) else (
    echo ℹ️  Процессы Node.js не найдены
)

:: Останавливаем процессы npm
tasklist /FI "IMAGENAME eq npm.exe" 2>NUL | find /I /N "npm.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ Найдены процессы npm
    echo 🔄 Завершаем процессы...
    taskkill /F /IM npm.exe >nul 2>&1
    echo ✅ Процессы npm остановлены!
) else (
    echo ℹ️  Процессы npm не найдены
)

echo.
echo ✅ Система остановлена!
echo.
echo 👋 До свидания!
timeout /t 3 /nobreak >nul
