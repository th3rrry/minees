'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, AlertCircle } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface OTCChartProps {
  pair: {
    id: string;
    symbol: string;
    name: string;
  };
}

const OTCChart: React.FC<OTCChartProps> = ({ pair }) => {
  const { t } = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-800/50 rounded-lg border border-gray-700 p-6"
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">
            {pair.symbol} - OTC Chart
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-yellow-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">OTC</span>
        </div>
      </div>

      {/* Контент */}
      <div className="bg-gray-900/50 rounded-lg p-8 text-center border border-gray-700/50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-gray-500" />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-lg font-medium text-gray-300">
              {t('otc.chartUnavailable')}
            </h4>
            <p className="text-sm text-gray-400 max-w-md">
              {t('otc.chartDescription')}
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>{t('otc.note')}:</strong> {t('otc.noteDescription')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OTCChart;
