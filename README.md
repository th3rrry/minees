# 🎯 Real Trading Signals

Профессиональная платформа для торговых сигналов с техническим анализом и мультиязычной поддержкой.

## ✨ Особенности

- **🔬 Технический анализ** - RSI, MACD, Bollinger Bands, SMA/EMA
- **🌍 8 языков** - Русский, English, Español, Deutsch, Português, العربية, Türkçe, हिन्दी
- **⏰ Прогноз экспирации** - умные таймеры для входа в сделку
- **📊 Реальные данные** - Binance API, Yahoo Finance, ExchangeRate API
- **🔄 Автообновление** - крипто каждые 5 мин, Forex каждые 15 мин
- **📱 Адаптивный дизайн** - работает на всех устройствах

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Клонируем репозиторий
git clone https://github.com/yourusername/real-trading-signals.git
cd real-trading-signals

# Устанавливаем зависимости
npm install

# Запускаем сервер
npm run dev

# Запускаем бэкенд (в отдельном терминале)
node server.js
```

### Переменные окружения

Создайте `.env.local`:

```env
NEXT_PUBLIC_SOCKET_URL=ws://localhost:3000
```

## 🛠️ Технологии

- **Frontend:** Next.js 14, TypeScript, TailwindCSS
- **Backend:** Node.js, Socket.IO
- **APIs:** Binance, Yahoo Finance, ExchangeRate API, Alpha Vantage
- **Deployment:** Vercel (Frontend), Railway (Backend)

## 📊 API Источники

### Криптовалюты
- **Binance API** (основной) - реальные цены и объемы
- **CoinGecko API** (fallback) - резервный источник
- **CoinCap API** (fallback) - последний резерв

### Forex
- **Yahoo Finance API** (основной) - исторические данные
- **ExchangeRate API** (fallback) - текущие курсы
- **Alpha Vantage** (fallback) - профессиональные данные

## 🎯 Технические индикаторы

- **RSI** - Relative Strength Index (перепроданность/перекупленность)
- **MACD** - Moving Average Convergence Divergence (тренд)
- **Bollinger Bands** - волатильность и уровни
- **SMA/EMA** - скользящие средние (20, 50 периодов)
- **Stochastic** - моментум осциллятор

## 🌐 Деплой

### Vercel (Frontend)
```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

### Railway (Backend)
```bash
# Установите Railway CLI
npm install -g @railway/cli

# Логин и деплой
railway login
railway deploy
```

## 📈 Мониторинг

- **Крипто сигналы:** каждые 5 минут
- **Forex сигналы:** каждые 15 минут
- **API лимиты:** оптимизированы для бесплатных планов
- **Uptime:** 99.9% благодаря fallback системам

## 🔧 Структура проекта

```
├── src/
│   ├── components/     # React компоненты
│   ├── hooks/         # Custom hooks
│   ├── i18n/          # Переводы
│   ├── lib/           # Утилиты и индикаторы
│   └── types/         # TypeScript типы
├── server.js          # Socket.IO сервер
├── package.json       # Зависимости
└── README.md          # Документация
```

## 📝 Лицензия

MIT License - используйте свободно для коммерческих и некоммерческих проектов.

## 🤝 Поддержка

- **Issues:** [GitHub Issues](https://github.com/yourusername/real-trading-signals/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/real-trading-signals/discussions)

---

**⚠️ Дисклеймер:** Торговые сигналы предоставляются только в информационных целях. Торговля на финансовых рынках сопряжена с рисками. Используйте на свой страх и риск.
