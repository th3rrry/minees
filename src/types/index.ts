export interface CurrencyPair {
  id: string;
  symbol: string;
  name: string;
  base: string;
  quote: string;
  icon?: string;
  category?: 'forex' | 'crypto' | 'otc';
}

export interface TradingSignal {
  id: string;
  pair: string;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  explanation: string;
  explanationParams?: Record<string, string | number>;
  timestamp: number;
  price: number;
  change24h: number;
  technicalReasoning?: string;
  analysisType?: 'technical' | 'price_change';
}

export interface PriceData {
  pair: string;
  price: number;
  change24h: number;
  volume: number;
  high24h: number;
  low24h: number;
}

export interface SocketEvents {
  'signal-update': (signal: TradingSignal) => void;
  'price-update': (price: PriceData) => void;
  'connection': () => void;
  'disconnect': () => void;
}
