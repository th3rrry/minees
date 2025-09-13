import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TranslationProvider } from '@/hooks/useTranslations'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trading Signals - Premium Trading Platform',
  description: 'Professional trading signals with real-time analysis and premium UI',
  keywords: 'trading, signals, forex, crypto, binary options, analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" dir="ltr">
      <body className={inter.className}>
        <TranslationProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
            {children}
          </div>
        </TranslationProvider>
      </body>
    </html>
  )
}
