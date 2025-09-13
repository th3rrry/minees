'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Target, Clock, Wifi, WifiOff } from 'lucide-react';
import { TradingSignal as SignalType } from '@/types';
import { useSocket } from '@/hooks/useSocket';
import { useTranslations } from '@/hooks/useTranslations';
import SignalCountdown from './SignalCountdown';
import ExpirationTimer from './ExpirationTimer';

interface TradingSignalProps {
  pair: string;
}

// Функция для перевода технических терминов
const translateTechnicalReasoning = (reasoning: string, t: any) => {
  if (!reasoning) return '';
  
  return reasoning.split(', ').map(term => {
    if (term.includes(':')) {
      const [key, value] = term.split(':');
      const translatedKey = t(`signals.technicalTerms.${key}`);
      return `${translatedKey} (${value})`;
    } else {
      return t(`signals.technicalTerms.${term}`);
    }
  }).join(', ');
};

export default function TradingSignal({ pair }: TradingSignalProps) {
  const [signal, setSignal] = useState<SignalType | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { socket, isConnected, currentSignal, emit } = useSocket();
  const { t } = useTranslations();

  // Убираем функцию generateSignal - используем только Socket.IO

  // Используем сигнал из Socket.IO если он для текущей пары
  useEffect(() => {
    if (currentSignal && currentSignal.pair === pair) {
      setSignal(currentSignal);
      // Используем время из сигнала, а не текущее время
      setLastUpdate(new Date(currentSignal.timestamp));
    }
  }, [currentSignal, pair]);

  useEffect(() => {
    // Запрашиваем существующий сигнал (если есть)
    if (socket && isConnected) {
      emit('request-signal', pair);
    }
  }, [pair, socket, isConnected]);

  // Определяем тип пары (крипто или форекс)
  const isCryptoPair = () => {
    const cryptoPairs = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT'];
    return cryptoPairs.includes(pair.toUpperCase());
  };

  const getSignalIcon = (signalType: string) => {
    switch (signalType) {
      case 'BUY':
        return <TrendingUp className="w-8 h-8" />;
      case 'SELL':
        return <TrendingDown className="w-8 h-8" />;
      default:
        return <Minus className="w-8 h-8" />;
    }
  };

  const getSignalColor = (signalType: string) => {
    switch (signalType) {
      case 'BUY':
        return 'signal-buy';
      case 'SELL':
        return 'signal-sell';
      default:
        return 'signal-neutral';
    }
  };

  const getSignalText = (signalType: string) => {
    switch (signalType) {
      case 'BUY':
        return t('signals.buy');
      case 'SELL':
        return t('signals.sell');
      default:
        return t('signals.neutral');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="premium-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {t('signals.title')}
              </h2>
              <p className="text-gray-400">
                {t('signals.analysis')} {pair}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">{t('trading.live')}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm font-medium">{t('status.disconnected')}</span>
              </>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {signal ? (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Основной сигнал */}
              <div className={`${getSignalColor(signal.signal)} p-6 rounded-xl text-center`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center space-y-4"
                >
                  <div className="p-4 bg-white/20 rounded-full">
                    {getSignalIcon(signal.signal)}
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-bold mb-2">
                      {getSignalText(signal.signal)}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-lg opacity-90">{t('signals.confidence')}:</span>
                      <span className="text-2xl font-bold">
                        {signal.confidence}%
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm opacity-80">{t('expiration.expiration')}:</span>
                      <span className="text-lg font-semibold text-blue-300">
                        {signal.confidence >= 90 ? t('expiration.timeframes.5min') : 
                         signal.confidence >= 80 ? t('expiration.timeframes.3min') : 
                         t('expiration.timeframes.1min')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Объяснение сигнала */}
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span>{t('signals.explanation')}</span>
                  {signal.analysisType === 'technical' && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      {t('signals.technicalAnalysis')}
                    </span>
                  )}
                </h4>
                <p className="text-gray-300 leading-relaxed mb-3">
                  {signal.explanationParams ? 
                    t(signal.explanation, signal.explanationParams) : 
                    t(signal.explanation)
                  }
                </p>
                {signal.technicalReasoning && (
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-300">
                      <strong>{t('signals.technicalReasoning')}:</strong> {translateTechnicalReasoning(signal.technicalReasoning, t)}
                    </p>
                  </div>
                )}
              </div>

              {/* Дополнительная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">{t('trading.currentPrice')}</span>
                    <span className="text-white font-semibold">
                      ${signal.price.toFixed(4)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">{t('trading.change24h')}</span>
                    <span className={`font-semibold ${
                      signal.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {signal.change24h >= 0 ? '+' : ''}{signal.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Прогресс до следующего сигнала */}
              <SignalCountdown
                lastUpdate={lastUpdate}
                isCrypto={isCryptoPair()}
                isConnected={isConnected}
              />

              {/* Прогноз экспирации */}
              <ExpirationTimer
                signalType={signal.signal.toLowerCase() as 'buy' | 'sell' | 'neutral'}
                confidence={signal.confidence}
                lastUpdate={lastUpdate}
                isConnected={isConnected}
                signalId={signal.id}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">{t('common.loading')} {t('signals.title').toLowerCase()}...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
