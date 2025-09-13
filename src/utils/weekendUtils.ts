/**
 * Утилиты для работы с выходными днями и рынками
 */

export type MarketType = 'crypto' | 'forex' | 'otc';

export interface MarketStatus {
  isAvailable: boolean;
  reason?: string;
  nextAvailable?: Date;
}

/**
 * Определяет, является ли день выходным
 */
export function isWeekend(date: Date = new Date()): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Воскресенье (0) или Суббота (6)
}

/**
 * Определяет, является ли день рабочим днем
 */
export function isWorkingDay(date: Date = new Date()): boolean {
  return !isWeekend(date);
}

/**
 * Получает следующий рабочий день
 */
export function getNextWorkingDay(date: Date = new Date()): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (isWeekend(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}

/**
 * Получает статус доступности рынка
 * 
 * Логика доступности:
 * - Forex: Закрыт в выходные (суббота, воскресенье)
 * - Crypto: Закрыт в выходные (суббота, воскресенье) 
 * - OTC: Доступен всегда (24/7)
 */
export function getMarketStatus(market: MarketType): MarketStatus {
  const now = new Date();
  const isWeekendDay = isWeekend(now);
  
  switch (market) {
    case 'crypto':
      // Криптовалюты недоступны в выходные
      if (isWeekendDay) {
        return {
          isAvailable: false,
          reason: 'crypto_weekend_closed',
          nextAvailable: getNextWorkingDay(now)
        };
      }
      return {
        isAvailable: true,
        reason: 'crypto_available'
      };
      
    case 'forex':
      // Forex недоступен в выходные
      if (isWeekendDay) {
        return {
          isAvailable: false,
          reason: 'forex_weekend_closed',
          nextAvailable: getNextWorkingDay(now)
        };
      }
      return {
        isAvailable: true,
        reason: 'forex_available'
      };
      
    case 'otc':
      // OTC доступен всегда (единственный рынок в выходные)
      return {
        isAvailable: true,
        reason: 'otc_available_24_7'
      };
      
    default:
      return {
        isAvailable: false,
        reason: 'unknown_market'
      };
  }
}

/**
 * Получает список доступных рынков
 */
export function getAvailableMarkets(): MarketType[] {
  const markets: MarketType[] = ['crypto', 'forex', 'otc'];
  return markets.filter(market => getMarketStatus(market).isAvailable);
}

/**
 * Получает список недоступных рынков
 */
export function getUnavailableMarkets(): MarketType[] {
  const markets: MarketType[] = ['crypto', 'forex', 'otc'];
  return markets.filter(market => !getMarketStatus(market).isAvailable);
}

/**
 * Форматирует дату для отображения
 */
export function formatDate(date: Date, locale: string = 'en'): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Получает название дня недели
 */
export function getDayName(date: Date, locale: string = 'en'): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long'
  }).format(date);
}
