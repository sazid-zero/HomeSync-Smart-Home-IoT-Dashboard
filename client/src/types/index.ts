export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  theme_preference: string;
}

export interface Room {
  id: string;
  name: string;
  icon: string | null;
  device_count?: number;
  active_devices?: number;
}

export interface Device {
  id: string;
  room_id: string;
  room_name?: string;
  name: string;
  type: string;
  control_type: 'toggle' | 'slider';
  is_on: boolean;
  value: number;
  power_consumption: string | number; // sometimes DB returns string for decimals
  icon_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface SensorReading {
  id: string;
  device_id: string;
  reading_type: 'temperature' | 'humidity' | 'power' | 'co2' | 'pollutant';
  value: number;
  unit: string;
  recorded_at: string;
}

export interface AnalyticsData {
  date: string;
  total_consumption: number;
  reading_count: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'critical';
  is_read: boolean;
  created_at: string;
}
