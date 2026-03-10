import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext.tsx';
import type { Device, Notification } from '../types/index.ts';

let socket: Socket | null = null;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

type SocketEventHandlers = {
  onDeviceUpdate?: (device: Device) => void;
  onDeviceToggle?: (device: Device) => void;
  onEnvironmentUpdate?: (data: { temperature: number, humidity: number, co2: number, pollutant: number }) => void;
  onNewNotification?: (notification: Notification) => void;
  onPowerUpdate?: (data: any) => void;
};

export const useSocket = (handlers: SocketEventHandlers) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      return;
    }

    const token = localStorage.getItem('token');
    
    // Only connect if we have a token and aren't already connected
    if (!socket && token) {
      // In Vite, proxy might not handle websocket correctly on same port unless configured.
      // We'll connect directly to the backend URL parsed from VITE_API_URL
      const baseUrl = API_URL.replace('/api', '');
      
      socket = io(baseUrl, {
        auth: { token },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        console.log('Socket connected successfully');
      });

      socket.on('connect_error', (err) => {
         console.warn('Socket connection error:', err.message);
      });
    }

    if (socket) {
      // Register event handlers
      if (handlers.onDeviceUpdate) socket.on('device:update', handlers.onDeviceUpdate);
      if (handlers.onDeviceToggle) socket.on('device:toggle', handlers.onDeviceToggle);
      if (handlers.onEnvironmentUpdate) socket.on('environment:update', handlers.onEnvironmentUpdate);
      if (handlers.onNewNotification) socket.on('notification:new', handlers.onNewNotification);
      if (handlers.onPowerUpdate) socket.on('device:power_update', handlers.onPowerUpdate);
    }

    return () => {
      // Cleanup handlers on unmount
      if (socket) {
        if (handlers.onDeviceUpdate) socket.off('device:update', handlers.onDeviceUpdate);
        if (handlers.onDeviceToggle) socket.off('device:toggle', handlers.onDeviceToggle);
        if (handlers.onEnvironmentUpdate) socket.off('environment:update', handlers.onEnvironmentUpdate);
        if (handlers.onNewNotification) socket.off('notification:new', handlers.onNewNotification);
        if (handlers.onPowerUpdate) socket.off('device:power_update', handlers.onPowerUpdate);
      }
    };
  }, [isAuthenticated, handlers]);

  return socket;
};
