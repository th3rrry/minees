'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface ExpirationTimerProps {
  signalType: 'buy' | 'sell' | 'neutral';
  confidence: number;
  lastUpdate: Date | null;
  isConnected: boolean;
  signalId: string;
}

const ExpirationTimer: React.FC<ExpirationTimerProps> = ({
  signalType,
  confidence,
  lastUpdate,
  isConnected,
  signalId
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [entryTimeLeft, setEntryTimeLeft] = useState(0);
  const { t } = useTranslations();

  // Рассчитываем время экспирации на основе уверенности
  const getExpirationTime = () => {
    if (confidence >= 90) return 5; // 5 минут для высокоуверенных сигналов
    if (confidence >= 80) return 3; // 3 минуты
    if (confidence >= 70) return 1; // 1 минута
    if (confidence >= 60) return 1; // 1 минута
    return 1; // 1 минута для низкоуверенных
  };

  // Время для входа в сделку (минимум 15 секунд, максимум 1 минута)
  const getEntryTime = () => {
    const expirationTime = getExpirationTime();
    if (expirationTime === 1) return 0.25; // 15 секунд для 1 минуты
    if (expirationTime === 3) return 0.5;  // 30 секунд для 3 минут
    return 1; // 1 минута для 5 минут
  };

  useEffect(() => {
    if (!lastUpdate || !isConnected || signalType === 'neutral') {
      setTimeLeft(0);
      setEntryTimeLeft(0);
      return;
    }

    const expirationMinutes = getExpirationTime();
    const entryMinutes = getEntryTime();
    const expirationTime = new Date(lastUpdate.getTime() + expirationMinutes * 60 * 1000);
    const entryTime = new Date(lastUpdate.getTime() + entryMinutes * 60 * 1000);

    const updateTimers = () => {
      const now = new Date();
      const expirationDiff = Math.max(0, Math.floor((expirationTime.getTime() - now.getTime()) / 1000));
      const entryDiff = Math.max(0, Math.floor((entryTime.getTime() - now.getTime()) / 1000));
      
      // Отладочная информация
      console.log('ExpirationTimer Update:', {
        signalId,
        confidence,
        expirationMinutes,
        entryMinutes,
        expirationDiff,
        entryDiff,
        now: now.toLocaleTimeString(),
        expirationTime: expirationTime.toLocaleTimeString(),
        entryTime: entryTime.toLocaleTimeString()
      });
      
      setTimeLeft(expirationDiff);
      setEntryTimeLeft(entryDiff);
    };

    // Сбрасываем таймеры при новом сигнале
    setTimeLeft(0);
    setEntryTimeLeft(0);
    
    // Небольшая задержка для плавного обновления
    const resetTimeout = setTimeout(() => {
      updateTimers();
    }, 100);

    const interval = setInterval(updateTimers, 1000);

    return () => {
      clearTimeout(resetTimeout);
      clearInterval(interval);
    };
  }, [lastUpdate, isConnected, signalType, confidence, signalId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getExpirationProgress = () => {
    if (!lastUpdate) return 0;
    const totalTime = getExpirationTime() * 60;
    const elapsed = totalTime - timeLeft;
    return Math.min(100, (elapsed / totalTime) * 100);
  };

  const getEntryProgress = () => {
    if (!lastUpdate) return 0;
    const totalEntryTime = getEntryTime() * 60;
    const elapsed = totalEntryTime - entryTimeLeft;
    return Math.min(100, (elapsed / totalEntryTime) * 100);
  };

  const getStatusColor = () => {
    if (entryTimeLeft > 0) return 'text-green-400';
    if (timeLeft > 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = () => {
    if (entryTimeLeft > 0) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (timeLeft > 0) return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    return <Clock className="w-4 h-4 text-red-400" />;
  };

  const getStatusText = () => {
    if (entryTimeLeft > 0) return t('expiration.entryTime');
    if (timeLeft > 0) return t('expiration.expirationTime');
    return t('expiration.expired');
  };

  if (!isConnected || !lastUpdate) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mt-4"
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">
            {t('expiration.title')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Прогресс-бар экспирации */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">{t('expiration.expiration')}</span>
          <span className="text-xs text-gray-400">
            {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
          </span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getExpirationProgress()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Прогресс-бар входа */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">{t('expiration.entry')}</span>
          <span className="text-xs text-gray-400">
            {entryTimeLeft > 0 ? formatTime(entryTimeLeft) : '00:00'}
          </span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getEntryProgress()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {t('expiration.confidence')}: {confidence}%
        </span>
        <span>
          {t('expiration.recommended')}: {getExpirationTime() === 1 ? t('expiration.timeframes.1min') : 
                                         getExpirationTime() === 3 ? t('expiration.timeframes.3min') : 
                                         t('expiration.timeframes.5min')}
        </span>
      </div>

      {/* Предупреждение */}
      {entryTimeLeft === 0 && timeLeft > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-300"
        >
          ⚠️ {t('expiration.warning')}
        </motion.div>
      )}

      {/* Истекший сигнал */}
      {timeLeft === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300"
        >
          ❌ {t('expiration.expired')}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExpirationTimer;
