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

  const createRoom = async (name: string, icon?: string) => {
    try {
      const res = await api.post('/rooms', { name, icon });
      setRooms(prev => [...prev, res.data.room]);
      return res.data.room;
    } catch (err: any) {
      console.error('Error creating room:', err);
      throw err;
    }
  };

  const deleteRoom = async (id: string) => {
    // Optimistic removal
    setRooms(prev => prev.filter(r => r.id !== id));
    try {
      await api.delete(`/rooms/${id}`);
    } catch (err) {
      console.error('Error deleting room:', err);
      fetchRooms(); // revert on failure
      throw err;
    }
  };

  return { rooms, isLoading, error, refetch: fetchRooms, createRoom, deleteRoom };
};
