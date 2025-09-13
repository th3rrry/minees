'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface SignalCountdownProps {
  lastUpdate: Date | null;
  isCrypto: boolean;
  isConnected: boolean;
  pair?: string;
}

const SignalCountdown: React.FC<SignalCountdownProps> = ({
  lastUpdate,
  isCrypto,
  isConnected,
  pair = ''
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const { t } = useTranslations();

  // Интервалы в секундах
  const CRYPTO_INTERVAL = 5 * 60; // 5 минут
  const FOREX_INTERVAL = 15 * 60; // 15 минут
  const OTC_INTERVAL = 15 * 60; // 15 минут (как Forex)

  const isOTCPair = () => {
    return pair.startsWith('OTC_');
  };

  useEffect(() => {
    if (!lastUpdate || !isConnected) {
      setTimeLeft(0);
      setProgress(0);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const interval = isCrypto ? CRYPTO_INTERVAL : isOTCPair() ? OTC_INTERVAL : FOREX_INTERVAL;
      const nextUpdate = new Date(lastUpdate.getTime() + interval * 1000);
      const diff = Math.max(0, Math.floor((nextUpdate.getTime() - now.getTime()) / 1000));
      
      setTimeLeft(diff);
      
      // Прогресс от 0 до 100%
      const elapsed = interval - diff;
      const progressPercent = Math.min(100, (elapsed / interval) * 100);
      setProgress(progressPercent);
    };

    // Обновляем сразу
    updateCountdown();

    // Обновляем каждую секунду
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate, isCrypto, isConnected]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (progress < 30) return 'from-blue-500 to-cyan-500';
    if (progress < 70) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };

  const getStatusText = () => {
    if (!isConnected) return t('status.disconnected');
    if (!lastUpdate) return t('common.loading');
    if (timeLeft === 0) return t('status.connected');
    return t('status.connecting');
  };

  const getStatusColor = () => {
    if (!isConnected) return 'text-red-400';
    if (!lastUpdate) return 'text-yellow-400';
    if (timeLeft === 0) return 'text-green-400';
    return 'text-blue-400';
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-center space-x-2 text-red-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{t('status.disconnected')}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: timeLeft > 0 ? 360 : 0 }}
            transition={{ duration: 2, repeat: timeLeft > 0 ? Infinity : 0, ease: "linear" }}
          >
            <Zap className="w-4 h-4 text-blue-400" />
          </motion.div>
          <span className="text-sm font-medium text-white">
            {isCrypto ? t('signals.crypto') : isOTCPair() ? 'OTC' : t('signals.forex')} {t('signals.nextUpdate')}
          </span>
        </div>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Прогресс-бар */}
      <div className="w-full bg-gray-700/50 rounded-full h-2 mb-3 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Время и процент */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-lg font-bold text-white">
            {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-400">
            {t('signals.progress')}:
          </span>
          <span className="text-lg font-bold text-white ml-1">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-3 pt-3 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {t('signals.interval')}: {isCrypto ? '5' : isOTCPair() ? '15' : '15'} {t('common.minutes')}
          </span>
          <span>
            {t('signals.lastUpdate')}: {lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SignalCountdown;
