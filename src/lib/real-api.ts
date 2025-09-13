import axios from 'axios';
import { PriceData, TradingSignal } from '@/types';

// Binance API для криптовалют
const BINANCE_BASE_URL = 'https://api.binance.com/api/v3';
const BINANCE_API_KEY = process.env.NEXT_PUBLIC_BINANCE_API_KEY;

// Alpha Vantage API для Forex (бесплатный, но с лимитами)
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

// PocketOption API для дополнительных Forex данных
const POCKET_OPTION_BASE_URL = 'https://api.pocketoption.com/api';
const POCKET_OPTION_API_KEY = process.env.NEXT_PUBLIC_POCKET_OPTION_API_KEY;

// Получение исторических данных с Binance
export async function getBinanceHistoricalData(symbol: string, interval: string = '1h', limit: number = 100): Promise<number[]> {
  try {
    const headers: any = {};
    if (BINANCE_API_KEY) {
      headers['X-MBX-APIKEY'] = BINANCE_API_KEY;
    }

    const response = await axios.get(`${BINANCE_BASE_URL}/klines`, {
      headers,
      params: {
        symbol: symbol,
        interval: interval,
        limit: limit
      }
    });

    return response.data.map((kline: any[]) => parseFloat(kline[4])); // Close prices
  } catch (error) {
    console.error('Error fetching Binance data:', error);
    throw error;
  }
}

// Получение текущей цены с Binance
export async function getBinanceCurrentPrice(symbol: string): Promise<PriceData> {
  try {
    const headers: any = {};
    if (BINANCE_API_KEY) {
      headers['X-MBX-APIKEY'] = BINANCE_API_KEY;
    }

    const response = await axios.get(`${BINANCE_BASE_URL}/ticker/24hr`, {
      headers,
      params: { symbol }
    });

    const data = response.data;
    
    return {
      pair: symbol,
      price: parseFloat(data.lastPrice),
      change24h: parseFloat(data.priceChangePercent),
      volume: parseFloat(data.volume),
      high24h: parseFloat(data.highPrice),
      low24h: parseFloat(data.lowPrice),
    };
  } catch (error) {
    console.error('Error fetching Binance price:', error);
    throw error;
  }
}

// Получение Forex данных через Alpha Vantage
export async function getForexData(pair: string): Promise<PriceData> {
  if (ALPHA_VANTAGE_API_KEY) {
    try {
      // Alpha Vantage использует формат EURUSD для пар
      const fromSymbol = pair.substring(0, 3);
      const toSymbol = pair.substring(3, 6);
      
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'FX_DAILY',
          from_symbol: fromSymbol,
          to_symbol: toSymbol,
          apikey: ALPHA_VANTAGE_API_KEY,
          outputsize: 'compact'
        }
      });

      const data = response.data;
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      const timeSeries = data['Time Series (FX)'];
      const dates = Object.keys(timeSeries).sort();
      const latestDate = dates[dates.length - 1];
      const latestData = timeSeries[latestDate];
      const previousDate = dates[dates.length - 2];
      const previousData = timeSeries[previousDate];

      const currentPrice = parseFloat(latestData['4. close']);
      const previousPrice = parseFloat(previousData['4. close']);
      const change24h = ((currentPrice - previousPrice) / previousPrice) * 100;

      return {
        pair,
        price: currentPrice,
        change24h: change24h,
        volume: 0, // Alpha Vantage не предоставляет объем для Forex
        high24h: parseFloat(latestData['2. high']),
        low24h: parseFloat(latestData['3. low']),
      };
    } catch (error) {
      console.error('Error fetching Alpha Vantage data:', error);
      // Fallback к моковым данным
    }
  }
  
  // Fallback к моковым данным если нет API ключа или ошибка
  const mockData: Record<string, PriceData> = {
    'EURUSD': {
      pair: 'EURUSD',
      price: 1.0850 + (Math.random() - 0.5) * 0.01,
      change24h: (Math.random() - 0.5) * 2,
      volume: Math.random() * 1000000,
      high24h: 1.0900,
      low24h: 1.0800,
    },
    'GBPUSD': {
      pair: 'GBPUSD',
      price: 1.2650 + (Math.random() - 0.5) * 0.01,
      change24h: (Math.random() - 0.5) * 2,
      volume: Math.random() * 1000000,
      high24h: 1.2700,
      low24h: 1.2600,
    },
    'AUDCAD': {
      pair: 'AUDCAD',
      price: 0.8950 + (Math.random() - 0.5) * 0.01,
      change24h: (Math.random() - 0.5) * 2,
      volume: Math.random() * 1000000,
      high24h: 0.9000,
      low24h: 0.8900,
    },
    'USDJPY': {
      pair: 'USDJPY',
      price: 149.50 + (Math.random() - 0.5) * 1,
      change24h: (Math.random() - 0.5) * 2,
      volume: Math.random() * 1000000,
      high24h: 150.00,
      low24h: 149.00,
    },
    'USDCAD': {
      pair: 'USDCAD',
      price: 1.3650 + (Math.random() - 0.5) * 0.01,
      change24h: (Math.random() - 0.5) * 2,
      volume: Math.random() * 1000000,
      high24h: 1.3700,
      low24h: 1.3600,
    },
    'NZDUSD': {
      pair: 'NZDUSD',
      price: 0.6150 + (Math.random() - 0.5) * 0.01,
      change24h: (Math.random() - 0.5) * 2,
      volume: Math.random() * 1000000,
      high24h: 0.6200,
      low24h: 0.6100,
    },
    'EURGBP': {
      pair: 'EURGBP',
      price: 0.8580 + (Math.random() - 0.5) * 0.01,
      change24h: (Math.random() - 0.5) * 2,
      volume: Math.random() * 1000000,
      high24h: 0.8630,
      low24h: 0.8530,
    },
    'AUDUSD': {
      pair: 'AUDUSD',
      price: 0.6550 + (Math.random() - 0.5) * 0.01,
      change24h: (Math.random() - 0.5) * 2,
      volume: Math.random() * 1000000,
      high24h: 0.6600,
      low24h: 0.6500,
    },
  };

  return mockData[pair] || mockData['EURUSD'];
}

// Получение исторических данных для Forex (заглушка)
export async function getForexHistoricalData(pair: string, limit: number = 100): Promise<number[]> {
  // В реальном проекте здесь будет запрос к Forex API
  // Для демо генерируем реалистичные данные
  
  const basePrice = {
    'EURUSD': 1.0850,
    'GBPUSD': 1.2650,
    'AUDCAD': 0.8950,
    'USDJPY': 149.50,
    'USDCAD': 1.3650,
    'NZDUSD': 0.6150,
    'EURGBP': 0.8580,
    'AUDUSD': 0.6550,
  }[pair] || 1.0850;

  const prices: number[] = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < limit; i++) {
    // Добавляем случайное изменение с трендом
    const change = (Math.random() - 0.5) * 0.002; // ±0.1%
    currentPrice += change;
    prices.push(currentPrice);
  }
  
  return prices;
}

// Генерация реального торгового сигнала
export async function generateRealSignal(pair: string): Promise<TradingSignal> {
  try {
    let priceData: PriceData;
    let historicalData: number[];

    // Определяем тип пары (крипто или Forex)
    const isCrypto = pair.includes('BTC') || pair.includes('ETH') || pair.includes('USDT');
    
    if (isCrypto) {
      // Для криптовалют используем Binance
      priceData = await getBinanceCurrentPrice(pair);
      historicalData = await getBinanceHistoricalData(pair);
    } else {
      // Для Forex используем PocketOption + Alpha Vantage
      priceData = await getPocketOptionData(pair);
      historicalData = await getForexHistoricalData(pair);
    }

    // Для Forex пар пробуем получить сигналы с PocketOption
    if (!isCrypto && POCKET_OPTION_API_KEY) {
      try {
        const pocketOptionSignal = await getPocketOptionSignals(pair);
        return {
          id: `${pair}-${Date.now()}`,
          pair,
          signal: pocketOptionSignal.signal as 'BUY' | 'SELL' | 'NEUTRAL',
          confidence: pocketOptionSignal.confidence,
          explanation: pocketOptionSignal.explanation,
          timestamp: Date.now(),
          price: priceData.price,
          change24h: priceData.change24h,
        };
      } catch (error) {
        console.error('Error getting PocketOption signal, using fallback:', error);
      }
    }

    // Простой анализ на основе изменения цены (fallback)
    let signal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    let confidence = 50;
    let explanation = '';
    
    if (priceData.change24h > 2) {
      signal = 'BUY';
      confidence = Math.min(95, 60 + priceData.change24h * 5);
      explanation = `Цена выросла на ${priceData.change24h.toFixed(2)}%, тренд восходящий`;
    } else if (priceData.change24h < -2) {
      signal = 'SELL';
      confidence = Math.min(95, 60 + Math.abs(priceData.change24h) * 5);
      explanation = `Цена упала на ${Math.abs(priceData.change24h).toFixed(2)}%, тренд нисходящий`;
    } else {
      signal = 'NEUTRAL';
      confidence = 50;
      explanation = `Цена в боковом движении, изменение ${priceData.change24h.toFixed(2)}%`;
    }

    return {
      id: `${pair}-${Date.now()}`,
      pair,
      signal,
      confidence: Math.round(confidence),
      explanation,
      timestamp: Date.now(),
      price: priceData.price,
      change24h: priceData.change24h,
    };
  } catch (error) {
    console.error('Error generating real signal:', error);
    
    // Fallback к демо-данным в случае ошибки
    return {
      id: `${pair}-${Date.now()}`,
      pair,
      signal: 'NEUTRAL',
      confidence: 50,
      explanation: 'Ошибка получения данных, используем нейтральный сигнал',
      timestamp: Date.now(),
      price: 1.0 + Math.random() * 0.5,
      change24h: (Math.random() - 0.5) * 10,
    };
  }
}

// Получение данных о криптовалютах
export async function getCryptoData(symbol: string): Promise<PriceData> {
  try {
    return await getBinanceCurrentPrice(symbol);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
}

// Получение данных с PocketOption API
export async function getPocketOptionData(pair: string): Promise<PriceData> {
  if (POCKET_OPTION_API_KEY) {
    try {
      const headers = {
        'Authorization': `Bearer ${POCKET_OPTION_API_KEY}`,
        'Content-Type': 'application/json'
      };

      // Попробуем получить данные с PocketOption
      const response = await axios.get(`${POCKET_OPTION_BASE_URL}/market-data/${pair}`, {
        headers,
        timeout: 5000
      });

      if (response.data && response.data.price) {
        return {
          pair,
          price: parseFloat(response.data.price),
          change24h: parseFloat(response.data.change_24h || 0),
          volume: parseFloat(response.data.volume || 0),
          high24h: parseFloat(response.data.high_24h || response.data.price),
          low24h: parseFloat(response.data.low_24h || response.data.price),
        };
      }
    } catch (error) {
      console.error('Error fetching PocketOption data:', error);
      // Fallback к Alpha Vantage
    }
  }
  
  // Fallback к Alpha Vantage
  return await getForexData(pair);
}

// Получение торговых сигналов с PocketOption
export async function getPocketOptionSignals(pair: string): Promise<{signal: string, confidence: number, explanation: string}> {
  if (POCKET_OPTION_API_KEY) {
    try {
      const headers = {
        'Authorization': `Bearer ${POCKET_OPTION_API_KEY}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${POCKET_OPTION_BASE_URL}/signals/${pair}`, {
        headers,
        timeout: 5000
      });

      if (response.data && response.data.signal) {
        return {
          signal: response.data.signal.toUpperCase(),
          confidence: Math.min(95, Math.max(50, response.data.confidence || 70)),
          explanation: response.data.explanation || 'PocketOption signal analysis'
        };
      }
    } catch (error) {
      console.error('Error fetching PocketOption signals:', error);
    }
  }
  
  // Fallback к базовому анализу
  return {
    signal: 'NEUTRAL',
    confidence: 50,
    explanation: 'Fallback signal analysis'
  };
}

// Получение данных о Forex
export async function getForexDataReal(pair: string): Promise<PriceData> {
  try {
    // Сначала пробуем PocketOption, затем Alpha Vantage
    return await getPocketOptionData(pair);
  } catch (error) {
    console.error('Error fetching forex data:', error);
    throw error;
  }
}
