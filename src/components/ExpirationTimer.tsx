'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, AlertTriangle, CheckCircle, Hourglass } from 'lucide-react';
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

    const updateTimers = () => {
      const now = new Date().getTime();
      const updateTime = lastUpdate.getTime();
      const elapsed = (now - updateTime) / 1000; // в секундах

      const expirationTime = getExpirationTime() * 60; // в секундах
      const entryTime = getEntryTime() * 60; // в секундах

      const remainingExpiration = Math.max(0, expirationTime - elapsed);
      const remainingEntry = Math.max(0, entryTime - elapsed);

      setTimeLeft(remainingExpiration);
      setEntryTimeLeft(remainingEntry);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate, isConnected, signalType, signalId]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getExpirationProgress = (): number => {
    const expirationTime = getExpirationTime() * 60;
    return Math.max(0, Math.min(100, ((expirationTime - timeLeft) / expirationTime) * 100));
  };

  const getEntryProgress = (): number => {
    const entryTime = getEntryTime() * 60;
    return Math.max(0, Math.min(100, ((entryTime - entryTimeLeft) / entryTime) * 100));
  };

  // Определяем состояние кулдауна
  const getCountdownState = () => {
    if (timeLeft === 0) return 'expired';
    if (entryTimeLeft === 0 && timeLeft > 0) return 'entry_expired';
    if (entryTimeLeft > 0) return 'active';
    return 'waiting';
  };

  const countdownState = getCountdownState();

  // Получаем стили для разных состояний
  const getStateStyles = () => {
    switch (countdownState) {
      case 'active':
        return {
          bg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
          border: 'border-green-500/30',
          icon: 'text-green-400',
          text: 'text-green-300',
          progressBg: 'bg-gray-700/30'
        };
      case 'entry_expired':
        return {
          bg: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20',
          border: 'border-yellow-500/30',
          icon: 'text-yellow-400',
          text: 'text-yellow-300',
          progressBg: 'bg-gray-700/30'
        };
      case 'expired':
        return {
          bg: 'bg-gradient-to-br from-red-500/20 to-pink-500/20',
          border: 'border-red-500/30',
          icon: 'text-red-400',
          text: 'text-red-300',
          progressBg: 'bg-gray-700/30'
        };
      default:
        return {
          bg: 'bg-gray-800/50',
          border: 'border-gray-700',
          icon: 'text-gray-400',
          text: 'text-gray-300',
          progressBg: 'bg-gray-700/30'
        };
    }
  };

  const stateStyles = getStateStyles();

  // Получаем контент для разных состояний
  const getCountdownContent = () => {
    switch (countdownState) {
      case 'active':
        return {
          icon: <Clock className="w-8 h-8" />,
          title: t('expiration.title'),
          subtitle: `${t('expiration.entry')}: ${formatTime(entryTimeLeft)} | ${t('expiration.expiration')}: ${formatTime(timeLeft)}`,
          progress: getEntryProgress(),
          progressColor: 'from-green-500 to-emerald-500'
        };
      case 'entry_expired':
        return {
          icon: <AlertTriangle className="w-8 h-8" />,
          title: t('expiration.entryTimeExpired'),
          subtitle: `${t('expiration.expiration')}: ${formatTime(timeLeft)}`,
          progress: getExpirationProgress(),
          progressColor: 'from-yellow-500 to-orange-500'
        };
      case 'expired':
        return {
          icon: <CheckCircle className="w-8 h-8" />,
          title: t('expiration.signalExpired'),
          subtitle: t('expiration.waitForNextSignal'),
          progress: 100,
          progressColor: 'from-red-500 to-pink-500'
        };
      default:
        return {
          icon: <Hourglass className="w-8 h-8" />,
          title: t('expiration.waiting'),
          subtitle: t('expiration.waitingForSignal'),
          progress: 0,
          progressColor: 'from-gray-500 to-gray-600'
        };
    }
  };

  const content = getCountdownContent();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${stateStyles.bg} p-6 rounded-2xl border ${stateStyles.border} backdrop-blur-sm mt-4`}
    >
      {/* Центрированный контент */}
      <div className="text-center">
        {/* Иконка */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`${stateStyles.icon} mb-4 flex justify-center`}
        >
          {content.icon}
        </motion.div>

        {/* Заголовок */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-xl font-bold ${stateStyles.text} mb-2`}
        >
          {content.title}
        </motion.h3>

        {/* Подзаголовок */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-400 mb-4"
        >
          {content.subtitle}
        </motion.p>

        {/* Прогресс-бар */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3 }}
          className={`w-full ${stateStyles.progressBg} rounded-full h-3 mb-4 overflow-hidden`}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${content.progressColor} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${content.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center items-center space-x-4 text-xs text-gray-500"
        >
          <span>{t('expiration.confidence')}: {confidence}%</span>
          <span>•</span>
          <span>
            {getExpirationTime() === 1 ? t('expiration.timeframes.1min') : 
             getExpirationTime() === 3 ? t('expiration.timeframes.3min') : 
             t('expiration.timeframes.5min')}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExpirationTimer;