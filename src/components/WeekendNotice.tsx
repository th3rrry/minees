'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { isWeekend, getNextWorkingDay, formatDate, getMarketStatus } from '@/utils/weekendUtils';

export default function WeekendNotice() {
  const { t, locale } = useTranslations();
  
  // Проверяем, выходной ли день
  const isWeekendDay = isWeekend();
  const nextWorkingDay = getNextWorkingDay();
  
  // Получаем статус рынков
  const forexStatus = getMarketStatus('forex');
  const cryptoStatus = getMarketStatus('crypto');
  const otcStatus = getMarketStatus('otc');
  
  // Показываем уведомление только в выходные
  if (!isWeekendDay) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
    >
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-300">
              {t('weekend.weekendNotice')}
            </span>
            <div className="flex items-center space-x-3 text-xs">
              {/* Статус рынков - компактно */}
              <div className="flex items-center space-x-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  forexStatus.isAvailable ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className="text-gray-300">Forex</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  cryptoStatus.isAvailable ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className="text-gray-300">Crypto</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  otcStatus.isAvailable ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className="text-gray-300">OTC</span>
              </div>
            </div>
          </div>
          
          <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
            <span>{t('weekend.onlyOTC')}</span>
            <span>{t('weekend.nextAvailable')} {formatDate(nextWorkingDay, locale).split(',')[0]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
