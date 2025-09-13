@echo off
chcp 65001 >nul
title Trading Signals - Real Time

echo.
echo ========================================
echo    Trading Signals - Real Time
echo ========================================
echo.

:: Отключаем автоматическое закрытие при ошибках
setlocal enabledelayedexpansion

:: Проверяем Node.js
echo [1/2] Проверка Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не найден!
    echo.
    echo 🔧 Установите Node.js с https://nodejs.org/
    echo.
    echo ⚠️  Нажмите любую клавишу для выхода...
    pause >nul
    goto :end
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js найден: %NODE_VERSION%
)

:: Проверяем зависимости
echo.
echo [2/2] Проверка зависимостей...
if not exist "node_modules" (
    echo 📦 Устанавливаем зависимости...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Ошибка установки!
        echo.
        echo ⚠️  Нажмите любую клавишу для выхода...
        pause >nul
        goto :end
    )
) else (
    echo ✅ Зависимости найдены
)

:: Запускаем систему
echo.
echo 🚀 Запускаем Socket.IO сервер и Next.js...
echo 📡 Socket.IO сервер: http://localhost:3000
echo 🌐 Web приложение: http://localhost:3001
echo.
echo 🎯 Функции:
echo    ✅ Реальные технические индикаторы (RSI, MACD, SMA)
echo    ✅ Анализ валютных пар и криптовалют
echo    ✅ Синхронизация сигналов в реальном времени
echo    ✅ Обновление каждые 60 секунд
echo.
echo ⚠️  Для остановки нажмите Ctrl+C
echo.

:: Запускаем Socket.IO сервер в отдельном окне
echo 🔧 Запускаем Socket.IO сервер...
start "Socket.IO Server" cmd /k "node server.js"

:: Ждем 3 секунды для запуска сервера
timeout /t 3 /nobreak >nul

:: Запускаем Next.js в отдельном окне
echo 🔧 Запускаем Next.js приложение...
start "Next.js App" cmd /k "npm run dev"

:: Ждем 5 секунд и открываем браузер
echo.
echo ⏳ Ожидание запуска приложения...
timeout /t 5 /nobreak >nul

echo 🌐 Открываем браузер...
start http://localhost:3001

echo.
echo ✅ Система запущена!
echo.
echo 📋 Окна:
echo    - Socket.IO Server: http://localhost:3000
echo    - Next.js App: http://localhost:3001
echo.
echo ⚠️  Для остановки закройте окна сервера и приложения
echo.

:end
echo.
echo 👋 Спасибо за использование Trading Signals!
echo.
echo ⚠️  Нажмите любую клавишу для выхода...
pause >nul
