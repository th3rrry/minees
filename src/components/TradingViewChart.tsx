'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { CurrencyPair } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';

interface TradingViewChartProps {
  pair: CurrencyPair;
}

export default function TradingViewChart({ pair }: TradingViewChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslations();

  useEffect(() => {
    console.log('TradingViewChart: useEffect triggered for pair:', pair.id);
    
    // Добавляем глобальные CSS стили для TradingView
    const style = document.createElement('style');
    style.textContent = `
      #tradingview_chart {
        height: 570px !important;
        min-height: 570px !important;
      }
      #tradingview_chart iframe {
        height: 570px !important;
        min-height: 570px !important;
      }
      .tradingview-widget-container {
        height: 570px !important;
        min-height: 570px !important;
      }
      @media (max-width: 640px) {
        #tradingview_chart {
          height: 475px !important;
          min-height: 475px !important;
        }
        #tradingview_chart iframe {
          height: 475px !important;
          min-height: 475px !important;
        }
        .tradingview-widget-container {
          height: 475px !important;
          min-height: 475px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Проверяем, есть ли уже TradingView скрипт
    const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
    
    if (existingScript) {
      console.log('TradingViewChart: Script already exists, creating widget...');
      createWidget();
    } else {
      console.log('TradingViewChart: Loading TradingView script...');
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        console.log('TradingViewChart: Script loaded successfully');
        createWidget();
      };
      script.onerror = () => {
        console.error('TradingViewChart: Failed to load script');
        showError();
      };
      document.head.appendChild(script);
    }
    
                function createWidget() {
                  if (chartRef.current && window.TradingView) {
                    console.log('TradingViewChart: Creating widget for symbol:', getTradingViewSymbol(pair.id));

                    // Очищаем контейнер и устанавливаем ID
                    chartRef.current.innerHTML = '';
                    chartRef.current.id = 'tradingview_chart';

                    try {
                      new window.TradingView.widget({
                        autosize: true,
                        symbol: getTradingViewSymbol(pair.id),
                        interval: "1",
                        timezone: "Etc/UTC",
                        theme: "dark",
                        style: "1",
                        locale: "en",
                        toolbar_bg: "#1e1e1e",
                        enable_publishing: false,
                        allow_symbol_change: true,
                        container_id: 'tradingview_chart', // ВАЖНО: строка ID контейнера
                        width: "100%",
                        height: "100%",
                        hide_top_toolbar: false,
                        hide_legend: false,
                        save_image: false,
                        show_popup_button: true,
                        popup_width: "1200",
                        popup_height: "800",
                        backgroundColor: "rgba(19, 23, 34, 1)",
                        gridColor: "rgba(240, 243, 250, 0.07)",
                        studies: [
                          "RSI@tv-basicstudies",
                          "MASimple@tv-basicstudies",
                          "Volume@tv-basicstudies"
                        ]
                      });
                      console.log('TradingViewChart: Widget created successfully');
                      
                      // Принудительно устанавливаем высоту для TradingView виджета
                      setTimeout(() => {
                        const widget = document.querySelector('#tradingview_chart iframe') as HTMLIFrameElement;
                        if (widget) {
                          // Проверяем размер экрана для мобильных устройств
                          const isMobile = window.innerWidth <= 640;
                          const height = isMobile ? '475px' : '570px';
                          widget.style.height = `${height} !important`;
                          widget.style.minHeight = `${height} !important`;
                        }
                        
                        const container = document.querySelector('#tradingview_chart') as HTMLElement;
                        if (container) {
                          // Проверяем размер экрана для мобильных устройств
                          const isMobile = window.innerWidth <= 640;
                          const height = isMobile ? '475px' : '570px';
                          container.style.height = `${height} !important`;
                          container.style.minHeight = `${height} !important`;
                        }
                      }, 1000);
                    } catch (error) {
                      console.error('TradingViewChart: Error creating widget:', error);
                      showError();
                    }
                  } else {
                    console.error('TradingViewChart: Missing chartRef or TradingView not available');
                    showError();
                  }
                }
    
    function showError() {
      if (chartRef.current) {
        chartRef.current.innerHTML = `
          <div class="w-full h-full bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-lg flex items-center justify-center border border-red-700 p-4">
            <div class="text-center">
              <div class="mb-3 sm:mb-4">
                <BarChart3 class="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto" />
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-white mb-2">TradingView Error</h3>
              <p class="text-red-400 mb-3 sm:mb-4 text-sm sm:text-base">Failed to load chart for ${pair.symbol}</p>
              <div class="text-red-300 text-xs sm:text-sm">
                <p>Check console for details</p>
                <p>Symbol: ${getTradingViewSymbol(pair.id)}</p>
              </div>
            </div>
          </div>
        `;
      }
    }
    
    return () => {
      console.log('TradingViewChart: Cleaning up...');
      if (chartRef.current) {
        chartRef.current.innerHTML = '';
      }
      // Удаляем добавленные стили
      const addedStyles = document.querySelectorAll('style');
      addedStyles.forEach(style => {
        if (style.textContent?.includes('#tradingview_chart')) {
          style.remove();
        }
      });
    };
  }, [pair]);

  // Функция для преобразования символа в формат TradingView
  const getTradingViewSymbol = (pairId: string) => {
    const symbolMap: { [key: string]: string } = {
      // Криптовалюты - используем Binance
      'BTCUSDT': 'BINANCE:BTCUSDT',
      'ETHUSDT': 'BINANCE:ETHUSDT',
      'ADAUSDT': 'BINANCE:ADAUSDT',
      'DOTUSDT': 'BINANCE:DOTUSDT',
      'LINKUSDT': 'BINANCE:LINKUSDT',
      'UNIUSDT': 'BINANCE:UNIUSDT',
      'AAVEUSDT': 'BINANCE:AAVEUSDT',
      'SOLUSDT': 'BINANCE:SOLUSDT',
      
      // Forex - используем правильный формат FX:
      'EURUSD': 'FX:EURUSD',
      'GBPUSD': 'FX:GBPUSD',
      'AUDCAD': 'FX:AUDCAD',
      'USDJPY': 'FX:USDJPY',
      'USDCAD': 'FX:USDCAD',
      'NZDUSD': 'FX:NZDUSD',
      'EURGBP': 'FX:EURGBP',
      'AUDUSD': 'FX:AUDUSD'
    };
    
    return symbolMap[pairId] || 'BINANCE:BTCUSDT';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="premium-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                {t('chart.title')} {pair.symbol}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                {t('chart.technicalAnalysis')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs sm:text-sm font-medium">{t('trading.live')}</span>
          </div>
        </div>

        <div 
          ref={chartRef}
          className="w-full h-[475px] sm:h-[570px] md:h-[640px] lg:h-[710px] xl:h-[780px] rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 select-none"
          style={{ 
            userSelect: 'none', 
            WebkitUserSelect: 'none', 
            MozUserSelect: 'none', 
            msUserSelect: 'none',
            minHeight: '475px',
            height: '475px !important'
          }}
        />

        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs sm:text-sm">{t('trading.high24h')}</span>
              <span className="text-green-400 font-semibold text-sm sm:text-base">
                ${(1.0 + Math.random() * 0.1).toFixed(4)}
              </span>
            </div>
          </div>

          <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs sm:text-sm">{t('trading.low24h')}</span>
              <span className="text-red-400 font-semibold text-sm sm:text-base">
                ${(1.0 - Math.random() * 0.1).toFixed(4)}
              </span>
            </div>
          </div>

          <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs sm:text-sm">{t('trading.volatility')}</span>
              <span className="text-yellow-400 font-semibold text-sm sm:text-base">
                {(Math.random() * 5).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
