'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { TradingSignal, PriceData, SocketEvents } from '@/types';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentSignal, setCurrentSignal] = useState<TradingSignal | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);

  useEffect(() => {
    // Подключение к реальному Socket.IO серверу
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
    const socketInstance = io(socketUrl, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log('🔌 Connected to Socket.IO server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    socketInstance.on('signal-update', (signal: TradingSignal) => {
      console.log('📡 Received signal update:', signal);
      setCurrentSignal(signal);
    });

    socketInstance.on('signal-waiting', (data: { pair: string; message: string }) => {
      console.log('⏳ Signal waiting:', data);
      // Можно добавить состояние ожидания, если нужно
    });

    socketInstance.on('price-update', (price: PriceData) => {
      console.log('💰 Received price update:', price);
      setPriceData(price);
    });

    socketInstance.on('error', (error: any) => {
      console.error('❌ Socket error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const emit = (event: string, data: any) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  const on = (event: keyof SocketEvents, callback: (...args: any[]) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const off = (event: keyof SocketEvents, callback?: (...args: any[]) => void) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  return {
    socket,
    isConnected,
    currentSignal,
    priceData,
    emit,
    on,
    off,
  };
};
