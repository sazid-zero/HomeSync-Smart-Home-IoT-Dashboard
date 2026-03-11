import React, { useState } from 'react';
import { useRooms } from '../hooks/useRooms.ts';
import { useDevices } from '../hooks/useDevices.ts';
import { useSocket } from '../hooks/useSocket.ts';
import { ConfirmationModal } from '../components/ui/ConfirmationModal.tsx';

const ROOM_ICONS = [
    { value: 'living-room', label: 'Living Room' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'hall', label: 'Hall' },
];

const DEVICE_TYPES = [
    { type: 'light', label: 'Light', control: 'slider' as const, icon: 'light-bulb' },
    { type: 'ac', label: 'Air Conditioner', control: 'toggle' as const, icon: 'air-conditioner' },
    { type: 'humidifier', label: 'Humidifier', control: 'slider' as const, icon: 'droplet' },
    { type: 'tv', label: 'TV / Monitor', control: 'toggle' as const, icon: 'monitor' },
    { type: 'appliance', label: 'Appliance', control: 'toggle' as const, icon: 'plug' },
];

const RoomsPage: React.FC = () => {
    const { rooms, isLoading: loadingRooms, error: roomsError, createRoom, deleteRoom, refetch: refetchRooms } = useRooms();
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const { devices, isLoading: loadingDevices, toggleDevice, refetch: refetchDevices, createDevice, deleteDevice } = useDevices(selectedRoomId || undefined);

    // Modal states
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [showAddDevice, setShowAddDevice] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'room' | 'device'; id: string; name: string } | null>(null);

    // Form states
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomIcon, setNewRoomIcon] = useState('living-room');
    const [newDeviceName, setNewDeviceName] = useState('');
    const [newDeviceType, setNewDeviceType] = useState(DEVICE_TYPES[0]);
    const [formLoading, setFormLoading] = useState(false);

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

    const handleAddRoom = async () => {
        if (!newRoomName.trim()) return;
        setFormLoading(true);
        try {
            const room = await createRoom(newRoomName.trim(), newRoomIcon);
            setSelectedRoomId(room.id);
            setShowAddRoom(false);
            setNewRoomName('');
            setNewRoomIcon('living-room');
        } catch (err) {
            console.error('Failed to create room:', err);
        } finally {
            setFormLoading(false);
        }
    };

    const handleAddDevice = async () => {
        if (!newDeviceName.trim() || !selectedRoomId) return;
        setFormLoading(true);
        try {
            await createDevice({
                room_id: selectedRoomId,
                name: newDeviceName.trim(),
                type: newDeviceType.type,
                control_type: newDeviceType.control,
                icon_name: newDeviceType.icon,
            });
            setShowAddDevice(false);
            setNewDeviceName('');
            setNewDeviceType(DEVICE_TYPES[0]);
            refetchDevices();
        } catch (err) {
            console.error('Failed to create device:', err);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            if (deleteTarget.type === 'room') {
                await deleteRoom(deleteTarget.id);
                if (selectedRoomId === deleteTarget.id) {
                    setSelectedRoomId(rooms.find(r => r.id !== deleteTarget.id)?.id || null);
                }
                refetchRooms();
            } else {
                await deleteDevice(deleteTarget.id);
            }
        } catch (err) {
            console.error('Failed to delete:', err);
        } finally {
            setDeleteTarget(null);
        }
    };

    if (loadingRooms) {
        return <div className="flex-1 flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (roomsError) {
        return <div className="p-4 bg-red-100 text-red-600 rounded-lg">{roomsError}</div>;
    }

    return (
        <div className="flex flex-col h-full w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold theme-text-primary">Rooms</h1>
                <button
                    onClick={() => setShowAddRoom(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-cyan-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <span className="text-lg leading-none">+</span>
                    <span>Add Room</span>
                </button>
            </div>

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
                    <div key={room.id} className="relative group/tab flex items-center">
                        <button
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
                        {/* Delete room button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'room', id: room.id, name: room.name }); }}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover/tab:opacity-100 transition-opacity shadow-sm hover:scale-110"
                            title={`Delete ${room.name}`}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {/* Devices Grid */}
            <div className="flex-1 theme-card-bg rounded-3xl theme-shadow-strong p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold theme-text-primary">
                        {selectedRoomId ? rooms.find(r => r.id === selectedRoomId)?.name : 'All Devices'}
                    </h2>
                    <div className="flex items-center space-x-3">
                        <span className="text-xs theme-text-secondary">{devices.length} Devices</span>
                        {selectedRoomId && selectedRoomId !== '' && (
                            <button
                                onClick={() => setShowAddDevice(true)}
                                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 text-xs font-bold hover:bg-cyan-500/20 transition-colors"
                            >
                                <span className="text-sm leading-none">+</span>
                                <span>Add Device</span>
                            </button>
                        )}
                    </div>
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
                                className={`w-full rounded-2xl border transition-all duration-300 p-4 flex flex-col justify-between h-[140px] relative group/device ${
                                    device.is_on 
                                    ? 'theme-bg-secondary border-cyan-500/40 shadow-lg shadow-cyan-500/10 scale-[1.02]' 
                                    : 'theme-bg-tertiary border-transparent opacity-70 grayscale-[0.5]'
                                } hover:shadow-md hover:scale-[1.03]`}
                            >
                                {/* Delete device button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'device', id: device.id, name: device.name }); }}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold flex items-center justify-center opacity-0 group-hover/device:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                    title={`Delete ${device.name}`}
                                >
                                    ×
                                </button>

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

            {/* ====== MODALS ====== */}

            {/* Add Room Modal */}
            {showAddRoom && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowAddRoom(false)} />
                    <div className="relative theme-card-bg w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border theme-border animate-in zoom-in duration-300">
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto">
                                    <span className="text-2xl">🏠</span>
                                </div>
                                <h3 className="text-xl font-bold theme-text-primary">Add New Room</h3>
                                <p className="text-sm theme-text-secondary">Create a new room for your smart home</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-secondary uppercase tracking-wider ml-1">Room Name</label>
                                    <input
                                        type="text"
                                        value={newRoomName}
                                        onChange={e => setNewRoomName(e.target.value)}
                                        placeholder="e.g. Living Room, Garage..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent theme-text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-secondary uppercase tracking-wider ml-1">Room Icon</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {ROOM_ICONS.map(icon => (
                                            <button
                                                key={icon.value}
                                                onClick={() => setNewRoomIcon(icon.value)}
                                                className={`p-3 rounded-xl text-center text-xs font-medium transition-all ${
                                                    newRoomIcon === icon.value 
                                                        ? 'bg-cyan-500/10 border-2 border-cyan-500 text-cyan-600' 
                                                        : 'theme-bg-tertiary theme-text-secondary border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                            >
                                                {icon.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    onClick={handleAddRoom}
                                    disabled={!newRoomName.trim() || formLoading}
                                    className="w-full py-4 rounded-2xl bg-cyan-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 transition-transform active:scale-95 disabled:opacity-50"
                                >
                                    {formLoading ? 'Creating...' : 'Create Room'}
                                </button>
                                <button
                                    onClick={() => setShowAddRoom(false)}
                                    className="w-full py-4 rounded-2xl theme-bg-tertiary theme-text-secondary font-bold text-lg hover:opacity-80 transition-all border theme-border"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Device Modal */}
            {showAddDevice && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowAddDevice(false)} />
                    <div className="relative theme-card-bg w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border theme-border animate-in zoom-in duration-300">
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <h3 className="text-xl font-bold theme-text-primary">Add New Device</h3>
                                <p className="text-sm theme-text-secondary">
                                    Add a device to <strong>{rooms.find(r => r.id === selectedRoomId)?.name}</strong>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-secondary uppercase tracking-wider ml-1">Device Name</label>
                                    <input
                                        type="text"
                                        value={newDeviceName}
                                        onChange={e => setNewDeviceName(e.target.value)}
                                        placeholder="e.g. Desk Lamp, Smart TV..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent theme-text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-secondary uppercase tracking-wider ml-1">Device Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {DEVICE_TYPES.map(dt => (
                                            <button
                                                key={dt.type}
                                                onClick={() => setNewDeviceType(dt)}
                                                className={`p-3 rounded-xl text-center transition-all flex items-center space-x-2 ${
                                                    newDeviceType.type === dt.type
                                                        ? 'bg-cyan-500/10 border-2 border-cyan-500 text-cyan-600'
                                                        : 'theme-bg-tertiary theme-text-secondary border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                            >
                                                <img src={`/${dt.icon}.png`} alt={dt.label} className="w-5 h-5 theme-icon-filter" onError={e => { e.currentTarget.src = '/plug.png'; }} />
                                                <span className="text-xs font-bold">{dt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    onClick={handleAddDevice}
                                    disabled={!newDeviceName.trim() || formLoading}
                                    className="w-full py-4 rounded-2xl bg-cyan-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 transition-transform active:scale-95 disabled:opacity-50"
                                >
                                    {formLoading ? 'Adding...' : 'Add Device'}
                                </button>
                                <button
                                    onClick={() => setShowAddDevice(false)}
                                    className="w-full py-4 rounded-2xl theme-bg-tertiary theme-text-secondary font-bold text-lg hover:opacity-80 transition-all border theme-border"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!deleteTarget}
                title={`Delete ${deleteTarget?.type === 'room' ? 'Room' : 'Device'}`}
                message={`Are you sure you want to delete "${deleteTarget?.name}"?${
                    deleteTarget?.type === 'room' ? ' All devices in this room will also be removed.' : ''
                }`}
                confirmText="Delete"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};

export default RoomsPage;
