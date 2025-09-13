import { CurrencyPair } from '@/types';

export const CURRENCY_PAIRS: CurrencyPair[] = [
  // Forex пары
  {
    id: 'EURUSD',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    base: 'EUR',
    quote: 'USD',
  },
  {
    id: 'GBPUSD',
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    base: 'GBP',
    quote: 'USD',
  },
  {
    id: 'AUDCAD',
    symbol: 'AUD/CAD',
    name: 'Australian Dollar / Canadian Dollar',
    base: 'AUD',
    quote: 'CAD',
  },
  {
    id: 'USDJPY',
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    base: 'USD',
    quote: 'JPY',
  },
  {
    id: 'USDCAD',
    symbol: 'USD/CAD',
    name: 'US Dollar / Canadian Dollar',
    base: 'USD',
    quote: 'CAD',
  },
  {
    id: 'NZDUSD',
    symbol: 'NZD/USD',
    name: 'New Zealand Dollar / US Dollar',
    base: 'NZD',
    quote: 'USD',
  },
  {
    id: 'EURGBP',
    symbol: 'EUR/GBP',
    name: 'Euro / British Pound',
    base: 'EUR',
    quote: 'GBP',
  },
  {
    id: 'AUDUSD',
    symbol: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    base: 'AUD',
    quote: 'USD',
  },
  // Криптовалютные пары
  {
    id: 'BTCUSDT',
    symbol: 'BTC/USDT',
    name: 'Bitcoin / Tether',
    base: 'BTC',
    quote: 'USDT',
  },
  {
    id: 'ETHUSDT',
    symbol: 'ETH/USDT',
    name: 'Ethereum / Tether',
    base: 'ETH',
    quote: 'USDT',
  },
  {
    id: 'ADAUSDT',
    symbol: 'ADA/USDT',
    name: 'Cardano / Tether',
    base: 'ADA',
    quote: 'USDT',
  },
  {
    id: 'DOTUSDT',
    symbol: 'DOT/USDT',
    name: 'Polkadot / Tether',
    base: 'DOT',
    quote: 'USDT',
  },
  {
    id: 'LINKUSDT',
    symbol: 'LINK/USDT',
    name: 'Chainlink / Tether',
    base: 'LINK',
    quote: 'USDT',
  },
  {
    id: 'UNIUSDT',
    symbol: 'UNI/USDT',
    name: 'Uniswap / Tether',
    base: 'UNI',
    quote: 'USDT',
  },
  {
    id: 'AAVEUSDT',
    symbol: 'AAVE/USDT',
    name: 'Aave / Tether',
    base: 'AAVE',
    quote: 'USDT',
  },
  {
    id: 'SOLUSDT',
    symbol: 'SOL/USDT',
    name: 'Solana / Tether',
    base: 'SOL',
    quote: 'USDT',
  },
];

export const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3',
  BINANCE: 'https://api.binance.com/api/v3',
  ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
  POCKET_OPTION: 'https://api.pocketoption.com/api',
};

export const SOCKET_CONFIG = {
  url: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000',
  options: {
    transports: ['websocket'],
    autoConnect: true,
  },
};
