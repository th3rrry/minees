'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CurrencySelector from '@/components/CurrencySelector';
import TradingViewChart from '@/components/TradingViewChart';
import OTCChart from '@/components/OTCChart';
import TradingSignal from '@/components/TradingSignal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import WeekendNotice from '@/components/WeekendNotice';
import { CurrencyPair } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { isWeekend, getMarketStatus } from '@/utils/weekendUtils';

export default function Home() {
  const [selectedPair, setSelectedPair] = useState<CurrencyPair | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Определяем начальную категорию рынка с учетом выходных
  const getInitialMarketCategory = (): 'forex' | 'crypto' | 'otc' => {
    if (isWeekend()) {
      return 'otc'; // В выходные только OTC
    }
    return 'forex'; // По умолчанию Forex
  };
  
  const [marketCategory, setMarketCategory] = useState<'forex' | 'crypto' | 'otc'>(getInitialMarketCategory());
  const { t } = useTranslations();

  const handlePairSelect = (pair: CurrencyPair) => {
    setSelectedPair(pair);
    setIsAnalyzing(true);
    
    // Симуляция загрузки анализа
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleBackToSelection = () => {
    setSelectedPair(null);
    setIsAnalyzing(false);
  };

  // Безопасное изменение категории рынка с проверкой выходных
  const handleMarketCategoryChange = (newCategory: 'forex' | 'crypto' | 'otc') => {
    const marketStatus = getMarketStatus(newCategory);
    
    if (marketStatus.isAvailable) {
      setMarketCategory(newCategory);
    } else {
      // Если рынок недоступен, переключаем на OTC
      setMarketCategory('otc');
    }
  };

  return (
    <div className="min-h-screen">

      <AnimatePresence mode="wait">
        {!selectedPair ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Уведомление о выходных */}
            <WeekendNotice />
            
            <CurrencySelector 
              onSelect={handlePairSelect} 
              marketCategory={marketCategory}
              onMarketCategoryChange={handleMarketCategoryChange}
            />
          </motion.div>
        ) : (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-7xl mx-auto p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToSelection}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">{t('trading.selectPair')}</span>
                <span className="sm:hidden">Back</span>
              </motion.button>

              <div className="text-right">
                <h1 className="text-2xl font-bold text-white">
                  {selectedPair.symbol}
                </h1>
                <p className="text-gray-400">
                  {selectedPair.name}
                </p>
              </div>
            </div>

            {/* Loading State */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                >
                  <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {t('signals.analysis')} {selectedPair.symbol}
                    </h3>
                    <p className="text-gray-400">
                      {t('common.loading')} {t('chart.title')} {t('common.and')} {t('signals.title')} {t('trading.for')} {selectedPair.symbol}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Language Switcher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <LanguageSwitcher />
            </motion.div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Chart */}
              {selectedPair.category === 'otc' ? (
                <OTCChart pair={selectedPair} />
              ) : (
                <TradingViewChart pair={selectedPair} />
              )}
              
              {/* Signal */}
              <TradingSignal pair={selectedPair.id} />
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center space-x-2 bg-gray-800/50 px-6 py-3 rounded-full border border-gray-700">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 text-sm">
                  {t('status.updatesEvery5min')}
                </span>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="max-w-3xl mx-auto p-3 sm:p-1 bg-gray-800/10 rounded border border-gray-700/20">
                <h3 className="text-xs sm:text-xs font-normal text-yellow-200 mb-1 sm:mb-0" style={{ fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)' }}>
                  {t('disclaimer.title')}
                </h3>
                <p className="text-xs sm:text-xs text-gray-500 leading-tight sm:leading-tight" style={{ fontSize: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                  {t('disclaimer.text')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
