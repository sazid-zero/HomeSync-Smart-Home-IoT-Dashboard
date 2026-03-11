import { useState, useMemo } from 'react';
import { useDevices } from '../hooks/useDevices.ts';
import { useRooms } from '../hooks/useRooms.ts';

export default function ApplianceControlCard() {
    const { devices, toggleDevice, updateDeviceValue, isLoading: loadingDevices } = useDevices();
    const { rooms, isLoading: loadingRooms } = useRooms();
    const [selectedRoom, setSelectedRoom] = useState<string>('all');

    const isLoading = loadingDevices || loadingRooms;

    const dynamicRooms = useMemo(() => {
        return [
            { id: 'all', label: 'All' },
            ...rooms.map(r => ({ id: r.id, label: r.name }))
        ];
    }, [rooms]);

    const visibleAppliances = useMemo(() => {
        return devices.filter(d => 
            selectedRoom === 'all' ? true : d.room_id === selectedRoom
        );
    }, [devices, selectedRoom]);

    if (isLoading && devices.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col pt-2">
            {/* Header with room tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0 relative z-10">
                <div className="flex items-center space-x-2">
                    <span className="w-1 h-3 bg-cyan-500 rounded-full"></span>
                    <h1 className="text-xs font-bold theme-text-tertiary uppercase tracking-widest">Zone Matrix</h1>
                </div>
                <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-1">
                    {dynamicRooms.map(room => (
                        <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room.id)}
                            className={`px-4 py-1.5 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                                selectedRoom === room.id
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 border-cyan-500 scale-105'
                                    : 'theme-bg-tertiary theme-text-secondary border-transparent hover:theme-bg-primary'
                            }`}
                        >
                            {room.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Appliance Controls */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {visibleAppliances.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                        <img src="/plug.png" className="w-12 h-12 mb-2 grayscale" alt="none" />
                        <span className="text-[10px] font-black uppercase tracking-widest">No devices in this zone</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Toggle Controls */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold theme-text-tertiary uppercase tracking-tighter mb-2 opacity-50 flex items-center">
                                <div className="w-1.5 h-px bg-current mr-2"></div> Binary Logic
                            </h4>
                            {visibleAppliances
                                .filter(app => app.control_type === 'toggle') 
                                .map(app => (
                                    <div key={app.id} className="flex items-center justify-between group/line">
                                        <span className={`text-[11px] tracking-wide font-bold transition-colors ${app.is_on ? 'theme-text-primary' : 'theme-text-tertiary group-hover/line:theme-text-secondary'}`}>
                                            {app.name}
                                        </span>
                                        <button
                                            onClick={() => toggleDevice(app.id)}
                                            className={`relative inline-flex items-center h-5 w-10 rounded-full transition-all duration-300 ${
                                                app.is_on ? 'bg-cyan-500 shadow-lg shadow-cyan-500/20' : 'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block w-3.5 h-3.5 transform rounded-full shadow-sm transition-transform duration-300 ${
                                                    app.is_on ? 'translate-x-5.5 bg-white' : 'translate-x-1 bg-gray-400 dark:bg-gray-500'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                        </div>

                        {/* Slider Controls */}
                        <div className="space-y-4">
                             <h4 className="text-[10px] font-bold theme-text-tertiary uppercase tracking-tighter mb-2 opacity-50 flex items-center">
                                 <div className="w-1.5 h-px bg-current mr-2"></div> Analog Modulation
                            </h4>
                            {visibleAppliances
                                .filter(app => app.control_type === 'slider')
                                .map(app => (
                                    <div key={app.id} className="flex flex-col space-y-2 group/slider pr-2">
                                        <div className="flex justify-between items-center">
                                            <span className="theme-text-secondary font-bold text-[11px] tracking-wide truncate">
                                                {app.name}
                                            </span>
                                            <span className="text-[10px] font-black text-cyan-500">
                                                {app.value}%
                                            </span>
                                        </div>
                                        <div className="relative h-6 flex items-center">
                                             <div className="absolute inset-x-0 h-1.5 theme-bg-tertiary rounded-full overflow-hidden">
                                                 <div 
                                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 group-hover/slider:opacity-100 opacity-80"
                                                    style={{ width: `${Number(app.value)}%` }}
                                                 ></div>
                                             </div>
                                             <input
                                                type="range"
                                                min={0}
                                                max={100}
                                                value={Number(app.value)}
                                                onChange={(e) => updateDeviceValue(app.id, Number(e.target.value))}
                                                className="relative z-10 w-full h-full appearance-none bg-transparent cursor-pointer
                                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4
                                                [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-md
                                                [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
                                                [&::-webkit-slider-thumb]:border-cyan-500 [&::-webkit-slider-thumb]:shadow-lg"
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
