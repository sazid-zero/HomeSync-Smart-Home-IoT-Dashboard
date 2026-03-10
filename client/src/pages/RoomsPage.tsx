import React, { useState } from 'react';
import { useRooms } from '../hooks/useRooms.ts';
import { useDevices } from '../hooks/useDevices.ts';
import { useSocket } from '../hooks/useSocket.ts';

const RoomsPage: React.FC = () => {
    const { rooms, isLoading: loadingRooms, error: roomsError } = useRooms();
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const { devices, isLoading: loadingDevices, toggleDevice, refetch: refetchDevices } = useDevices(selectedRoomId || undefined);

    useSocket({
        onDeviceUpdate: () => refetchDevices(true),
        onDeviceToggle: () => refetchDevices(true)
    });

    // Auto-select first room when rooms load only if no room is selected yet
    React.useEffect(() => {
        if (rooms.length > 0 && selectedRoomId === null) {
            setSelectedRoomId(rooms[0].id);
        }
    }, [rooms, selectedRoomId]);

    const handleRoomSelect = (roomId: string) => {
        setSelectedRoomId(roomId);
    };

    if (loadingRooms) {
        return <div className="flex-1 flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (roomsError) {
        return <div className="p-4 bg-red-100 text-red-600 rounded-lg">{roomsError}</div>;
    }

    return (
        <div className="flex flex-col h-full w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            <h1 className="text-xl font-bold theme-text-primary">Rooms</h1>

            {/* Room Tabs */}
            <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-2">
                <button
                    onClick={() => handleRoomSelect('')}
                    className={`px-6 py-2 rounded-2xl whitespace-nowrap text-sm font-bold transition-all duration-300 ${
                        selectedRoomId === ''
                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-500/20 scale-105'
                            : 'theme-card-bg theme-text-secondary hover:opacity-80'
                    }`}
                >
                    All Devices
                </button>
                {rooms.map(room => (
                    <button
                        key={room.id}
                        onClick={() => handleRoomSelect(room.id)}
                        className={`px-6 py-2 rounded-2xl whitespace-nowrap text-sm font-bold transition-all duration-300 flex items-center ${
                            selectedRoomId === room.id
                                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-500/20'
                                : 'theme-card-bg theme-text-secondary hover:opacity-80'
                        }`}
                    >
                        {room.name}
                        <span className={`ml-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            selectedRoomId === room.id ? 'bg-white/20' : 'theme-bg-tertiary theme-text-secondary'
                        }`}>
                            {selectedRoomId === room.id ? devices.length : (room.device_count || 0)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Devices Grid */}
            <div className="flex-1 theme-card-bg rounded-3xl theme-shadow-strong p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold theme-text-primary">
                        {selectedRoomId ? rooms.find(r => r.id === selectedRoomId)?.name : 'All Devices'}
                    </h2>
                    <span className="text-xs theme-text-secondary">{devices.length} Devices</span>
                </div>

                {loadingDevices && devices.length === 0 ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : devices.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {devices.map(device => (
                            <div 
                                key={device.id} 
                                className={`w-full rounded-2xl border transition-all duration-300 p-4 flex flex-col justify-between h-[140px] ${
                                    device.is_on 
                                    ? 'theme-bg-secondary border-cyan-500/40 shadow-lg shadow-cyan-500/10 scale-[1.02]' 
                                    : 'theme-bg-tertiary border-transparent opacity-70 grayscale-[0.5]'
                                } hover:shadow-md hover:scale-[1.03] group`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                        device.is_on ? 'bg-cyan-500/10' : 'theme-bg-tertiary'
                                    }`}>
                                       <img 
                                            src={`/${device.icon_name || 'plug'}.png`} 
                                            alt="icon" 
                                            className={`w-5 h-5 transition-all ${
                                                device.is_on ? 'theme-icon-filter opacity-100 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'theme-icon-filter opacity-50'
                                            }`} 
                                            onError={(e) => { e.currentTarget.src = "/plug.png"; }} 
                                        />
                                    </div>
                                    <div
                                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${
                                            device.is_on ? 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]' : 'bg-gray-300 dark:bg-gray-700'
                                        }`}
                                        onClick={() => toggleDevice(device.id)}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                                                device.is_on ? 'translate-x-6' : 'translate-x-0'
                                            }`}
                                        ></div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className={`font-bold text-base truncate transition-colors ${
                                        device.is_on ? 'theme-text-primary' : 'theme-text-secondary'
                                    }`}>{device.name}</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${device.is_on ? 'bg-cyan-500 animate-pulse' : 'bg-gray-400'}`} />
                                        <p className="text-[10px] font-bold uppercase tracking-wider theme-text-tertiary">
                                            {device.is_on ? 'System Active' : 'Offline Mode'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 theme-text-tertiary text-center">
                        <img src="/router.png" alt="Empty" className="w-12 h-12 mb-4 opacity-50 grayscale" />
                        <p>No devices found in this room.</p>
                        <p className="text-xs mt-1">Try changing rooms or adding a new device.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomsPage;
