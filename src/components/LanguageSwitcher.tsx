'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { locales, Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = locales.find(l => l.code === locale);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-700 transition-all duration-200"
      >
        <img 
          src={`/img/${currentLocale?.code}.png`} 
          alt={currentLocale?.name}
          className="w-4 h-4 rounded-sm"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <Globe className="w-4 h-4 text-blue-400 hidden" />
        <span className="text-sm font-medium text-white">
          {currentLocale?.name}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-10"
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden"
            >
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                  {t('navigation.language')}
                </div>
                
                {locales.map((localeOption) => (
                  <motion.button
                    key={localeOption.code}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    onClick={() => handleLocaleChange(localeOption.code)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors duration-200 ${
                      locale === localeOption.code 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={`/img/${localeOption.code}.png`} 
                        alt={localeOption.name}
                        className="w-5 h-5 rounded-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <span className="text-lg hidden">{localeOption.flag}</span>
                      <span className="font-medium">{localeOption.name}</span>
                    </div>
                    
                    {locale === localeOption.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-4 h-4 text-blue-400" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
