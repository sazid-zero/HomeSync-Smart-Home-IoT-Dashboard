import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.ts';
import type { Room } from '../types/index.ts';

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/rooms');
      setRooms(res.data.rooms || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching rooms:', err);
      if (err.message !== 'Network Error' || !document.location.href.includes('localhost')) {
          setError(err.response?.data?.error || 'Failed to fetch rooms');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, isLoading, error, refetch: fetchRooms };
};
