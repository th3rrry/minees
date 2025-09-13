'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Globe } from 'lucide-react';
import { CurrencyPair } from '@/types';
import { CURRENCY_PAIRS } from '@/lib/constants';
import { useTranslations } from '@/hooks/useTranslations';
import { getMarketStatus } from '@/utils/weekendUtils';
import LanguageSwitcher from './LanguageSwitcher';

interface CurrencySelectorProps {
  onSelect: (pair: CurrencyPair) => void;
  selectedPair?: CurrencyPair;
  marketCategory?: 'forex' | 'crypto' | 'otc';
  onMarketCategoryChange?: (category: 'forex' | 'crypto' | 'otc') => void;
}

export default function CurrencySelector({ onSelect, selectedPair, marketCategory = 'forex', onMarketCategoryChange }: CurrencySelectorProps) {
  const [hoveredPair, setHoveredPair] = useState<string | null>(null);
  const { t } = useTranslations();

  const getCurrencyIcon = (base: string) => {
    const icons: Record<string, React.ReactNode> = {
      EUR: <DollarSign className="w-6 h-6 text-blue-400" />,
      USD: <DollarSign className="w-6 h-6 text-green-400" />,
      GBP: <TrendingUp className="w-6 h-6 text-red-400" />,
      JPY: <Globe className="w-6 h-6 text-yellow-400" />,
      CAD: <DollarSign className="w-6 h-6 text-purple-400" />,
      AUD: <TrendingUp className="w-6 h-6 text-orange-400" />,
      NZD: <Globe className="w-6 h-6 text-cyan-400" />,
    };
    return icons[base] || <DollarSign className="w-6 h-6 text-gray-400" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
          {t('trading.title')}
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          {t('trading.subtitle')}
        </p>
        <p className="text-gray-400">
          {t('trading.description')}
        </p>
      </motion.div>

      {/* Language Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex justify-center mb-6"
      >
        <LanguageSwitcher />
      </motion.div>

      {/* Market Category Selector */}
      {onMarketCategoryChange && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-800/50 p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => onMarketCategoryChange('forex')}
              disabled={!getMarketStatus('forex').isAvailable}
              className={`px-4 py-2 rounded-md transition-all ${
                marketCategory === 'forex'
                  ? 'bg-blue-600 text-white'
                  : getMarketStatus('forex').isAvailable
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 cursor-not-allowed opacity-50'
              }`}
              title={!getMarketStatus('forex').isAvailable ? t('weekend.forexClosed') : ''}
            >
              {t('signals.forex')}
            </button>
            <button
              onClick={() => onMarketCategoryChange('crypto')}
              disabled={!getMarketStatus('crypto').isAvailable}
              className={`px-4 py-2 rounded-md transition-all ${
                marketCategory === 'crypto'
                  ? 'bg-blue-600 text-white'
                  : getMarketStatus('crypto').isAvailable
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 cursor-not-allowed opacity-50'
              }`}
              title={!getMarketStatus('crypto').isAvailable ? t('weekend.cryptoClosed') : ''}
            >
              {t('signals.crypto')}
            </button>
            <button
              onClick={() => onMarketCategoryChange('otc')}
              disabled={!getMarketStatus('otc').isAvailable}
              className={`px-4 py-2 rounded-md transition-all ${
                marketCategory === 'otc'
                  ? 'bg-blue-600 text-white'
                  : getMarketStatus('otc').isAvailable
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 cursor-not-allowed opacity-50'
              }`}
              title={!getMarketStatus('otc').isAvailable ? t('weekend.otcAvailable') : ''}
            >
              OTC
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {CURRENCY_PAIRS
          .filter(pair => pair.category === marketCategory)
          .map((pair, index) => (
          <motion.div
            key={pair.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`currency-card ${
              selectedPair?.id === pair.id ? 'selected' : ''
            }`}
            onClick={() => onSelect(pair)}
            onMouseEnter={() => setHoveredPair(pair.id)}
            onMouseLeave={() => setHoveredPair(null)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getCurrencyIcon(pair.base)}
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {pair.symbol}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {pair.category === 'otc' ? pair.name : (t(`currency.${pair.id.toLowerCase()}`) || pair.name)}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ 
                  rotate: hoveredPair === pair.id ? 360 : 0,
                  scale: hoveredPair === pair.id ? 1.2 : 1 
                }}
                transition={{ duration: 0.3 }}
                className="text-blue-400"
              >
                <TrendingUp className="w-5 h-5" />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t('currency.baseCurrency')}:</span>
                <span className="text-white font-medium">{pair.base}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t('currency.quoteCurrency')}:</span>
                <span className="text-white font-medium">{pair.quote}</span>
              </div>
            </div>

            {selectedPair?.id === pair.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-2 bg-blue-500/20 rounded-lg border border-blue-500/30"
              >
                <p className="text-blue-300 text-sm font-medium text-center">
                  ✓ {t('currency.selected')}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {selectedPair && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-6 py-3 rounded-full border border-blue-500/30">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-medium">
              {t('currency.selected')}: {selectedPair.symbol}
            </span>
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
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
    </div>
  );
}
