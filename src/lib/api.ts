import { PriceData, TradingSignal } from '@/types';
import { generateRealSignal, getForexData, getCryptoData } from './real-api';

class TradingAPI {
  async getPriceData(pair: string): Promise<PriceData> {
    try {
      // Определяем тип пары
      const isCrypto = pair.includes('BTC') || pair.includes('ETH') || pair.includes('USDT');
      
      if (isCrypto) {
        return await getCryptoData(pair);
      } else {
        return await getForexData(pair);
      }
    } catch (error) {
      console.error('Error fetching price data:', error);
      // Возвращаем моковые данные в случае ошибки
      return this.getMockPriceData(pair);
    }
  }

  async generateSignal(pair: string): Promise<TradingSignal> {
    try {
      // Используем реальную генерацию сигналов с техническими индикаторами
      return await generateRealSignal(pair);
    } catch (error) {
      console.error('Error generating signal:', error);
      return this.getMockSignal(pair);
    }
  }

  private getMockPriceData(pair: string): PriceData {
    // Fallback данные только в случае критической ошибки
    return {
      pair,
      price: 1.0,
      change24h: 0,
      volume: 0,
      high24h: 1.0,
      low24h: 1.0,
    };
  }

  private getMockSignal(pair: string): TradingSignal {
    // Fallback сигнал только в случае критической ошибки
    return {
      id: `${pair}-${Date.now()}`,
      pair,
      signal: 'NEUTRAL',
      confidence: 0,
      explanation: 'Ошибка получения данных',
      timestamp: Date.now(),
      price: 1.0,
      change24h: 0,
    };
  }
}

export const tradingAPI = new TradingAPI();
