import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.ts';
import { useSocket } from '../hooks/useSocket.ts';
import type { Device, SensorReading } from '../types/index.ts';

const DeviceDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [device, setDevice] = useState<Device | null>(null);
    const [history, setHistory] = useState<SensorReading[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDeviceData = async () => {
        try {
            const [deviceRes, historyRes] = await Promise.all([
                api.get(`/devices/${id}`),
                api.get(`/sensors/device/${id}?limit=20`)
            ]);
            setDevice(deviceRes.data.device);
            setHistory(historyRes.data.readings || []);
            setError(null);
        } catch (err: any) {
             if (err.message !== 'Network Error' || !document.location.href.includes('localhost')) {
                setError(err.response?.data?.error || 'Failed to fetch device details');
             }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchDeviceData();
        }
    }, [id]);

    useSocket({
        onDeviceUpdate: (updated) => {
            if (updated.id === id) setDevice(updated);
        },
        onDeviceToggle: (updated) => {
            if (updated.id === id) setDevice(updated);
        },
        onPowerUpdate: (data) => {
            if (data.id === id) setDevice(prev => prev ? { ...prev, power_consumption: data.power } : prev);
        }
    });

    const toggleDevice = async () => {
        if (!device) return;
        setDevice({ ...device, is_on: !device.is_on }); // optimistic update
        try {
            await api.patch(`/devices/${device.id}/toggle`);
        } catch (err) {
            setDevice({ ...device, is_on: device.is_on }); // revert
            console.error('Failed to toggle:', err);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;
    if (error || !device) return <div className="p-4 bg-red-100 text-red-600 rounded-lg m-6">{error || 'Device not found'}</div>;

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-4">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full theme-bg-tertiary flex items-center justify-center hover:opacity-80 transition-opacity">
                    &larr;
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold theme-text-primary capitalize">{device.name}</h1>
                    <p className="text-sm theme-text-secondary">Connected &middot; {device.is_on ? 'Active' : 'Offline'}</p>
                </div>
                <div
                    className="w-14 h-7 rounded-full p-1 cursor-pointer"
                    style={{ background: 'var(--gradient-bg)' }}
                    onClick={toggleDevice}
                >
                    <div
                        className={`w-5 h-5 rounded-full transition-transform duration-200 ${
                            device.is_on ? 'translate-x-7 theme-text-primary' : 'translate-x-0 bg-white'
                        }`}
                        style={{ backgroundColor: device.is_on ? 'var(--text-primary)' : 'white' }}
                    ></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Control Card */}
                <div className="md:col-span-2 theme-card-bg rounded-3xl theme-shadow-strong p-6 flex flex-col items-center justify-center min-h-[300px]">
                     <img 
                        src={`/${device.icon_name || 'plug'}.png`} 
                        alt={device.name} 
                        className={`w-32 h-32 object-contain transition-all ${device.is_on ? 'theme-icon-filter drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'opacity-50 grayscale'}`} 
                        onError={(e) => { e.currentTarget.src = "/plug.png"; }} 
                     />
                     <div className="mt-8 text-center">
                         <div className="text-4xl font-bold theme-text-primary">{Number(device.power_consumption).toFixed(2)}</div>
                         <div className="text-sm theme-text-secondary uppercase tracking-widest mt-1">Kilowatts Rate</div>
                     </div>
                </div>

                {/* Info Panel */}
                <div className="space-y-6">
                    <div className="theme-card-bg rounded-2xl theme-shadow-strong p-5">
                        <h3 className="text-sm font-bold theme-text-secondary mb-4 uppercase tracking-wider">Device Info</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                                <span className="theme-text-tertiary">Type</span>
                                <span className="theme-text-primary font-medium capitalize">{device.type}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                                <span className="theme-text-tertiary">Room ID</span>
                                <span className="theme-text-primary font-medium">{device.room_id.substring(0,8)}...</span>
                            </div>
                            <div className="flex justify-between pb-1">
                                <span className="theme-text-tertiary">Added</span>
                                <span className="theme-text-primary font-medium">{new Date(device.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="theme-card-bg rounded-2xl theme-shadow-strong p-5">
                        <h3 className="text-sm font-bold theme-text-secondary mb-4 uppercase tracking-wider">Recent Activity</h3>
                        <div className="space-y-4">
                            {history.length === 0 ? (
                                <p className="text-sm theme-text-tertiary text-center py-2">No activity recorded</p>
                            ) : (
                                history.slice(0, 4).map(reading => (
                                    <div key={reading.id} className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-sm theme-text-primary">{reading.reading_type === 'power' ? 'Power Update' : 'State Change'}</span>
                                            <span className="text-xs theme-text-tertiary">{new Date(reading.recorded_at).toLocaleTimeString()}</span>
                                        </div>
                                        <span className="text-sm font-bold text-cyan-500">{Number(reading.value).toFixed(2)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceDetailPage;
