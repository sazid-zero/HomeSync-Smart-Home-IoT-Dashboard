import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.ts';
import type { Device } from '../types/index.ts';

export const useDevices = (roomId?: string) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    try {
      const endpoint = roomId ? `/devices/room/${roomId}` : '/devices';
      const res = await api.get(endpoint);
      setDevices(res.data.devices || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching devices:', err);
      // Don't show error if we're just falling back to demo mode on network failure
      if (err.message !== 'Network Error' || !document.location.href.includes('localhost')) {
         setError(err.response?.data?.error || 'Failed to fetch devices');
      }
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const toggleDevice = async (id: string) => {
    // Optimistic UI update
    setDevices(prev => prev.map(d => d.id === id ? { ...d, is_on: !d.is_on } : d));
    try {
      await api.patch(`/devices/${id}/toggle`);
    } catch (err) {
      // Revert on failure
      setDevices(prev => prev.map(d => d.id === id ? { ...d, is_on: !d.is_on } : d));
      console.error('Failed to toggle device:', err);
    }
  };

  const updateDeviceValue = async (id: string, value: number) => {
      // Optimistic UI update
      setDevices(prev => prev.map(d => d.id === id ? { ...d, value } : d));
      try {
        await api.patch(`/devices/${id}/value`, { value });
      } catch (err) {
          fetchDevices(); // Reload actual state on error
          console.error('Failed to update value:', err);
      }
  };

  const createDevice = async (data: {
    room_id: string;
    name: string;
    type: string;
    control_type: 'toggle' | 'slider';
    icon_name?: string;
  }) => {
    try {
      const res = await api.post('/devices', data);
      setDevices(prev => [...prev, res.data.device]);
      return res.data.device;
    } catch (err: any) {
      console.error('Error creating device:', err);
      throw err;
    }
  };

  const deleteDevice = async (id: string) => {
    // Optimistic removal
    setDevices(prev => prev.filter(d => d.id !== id));
    try {
      await api.delete(`/devices/${id}`);
    } catch (err) {
      console.error('Error deleting device:', err);
      fetchDevices(); // revert on failure
      throw err;
    }
  };

  return { devices, isLoading, error, refetch: fetchDevices, toggleDevice, updateDeviceValue, createDevice, deleteDevice };
};
