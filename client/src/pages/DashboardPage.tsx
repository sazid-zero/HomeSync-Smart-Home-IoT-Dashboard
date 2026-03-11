
import React, { useState } from 'react';
import { useDevices } from '../hooks/useDevices.ts';
import { useSocket } from '../hooks/useSocket.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import type { Device } from '../types/index.ts';
import TimeRangeDropdown from "../components/DropDownMenu.tsx";
import TemperatureChart from "../components/TemperatureChart.tsx";
import ApplianceControlCard from "../components/ApplianceControlCard.tsx";
import WelcomeModal from "../components/WelcomeModal.tsx";

interface DeviceCardProps {
    device: Device;
    onToggle: (id: string) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onToggle }) => {
    // We rely on the parent state for optimistic updates
    const isOn = device.is_on;

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        onToggle(device.id);
    };

    return (
        <div className={`w-full h-[160px] rounded-3xl transition-all duration-300 p-5 flex justify-between border ${
            isOn 
            ? 'theme-bg-secondary border-cyan-500/40 shadow-xl shadow-cyan-500/10 scale-[1.02]' 
            : 'theme-bg-secondary border-transparent shadow-md opacity-80'
        } hover:shadow-lg group`}>
            <div className="flex flex-col justify-between h-full">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    isOn ? 'bg-cyan-500/10' : 'theme-bg-tertiary'
                }`}>
                    <img 
                        src={`/${device.icon_name || 'plug'}.png`} 
                        alt="icon" 
                        className={`w-7 h-7 transition-all ${
                            isOn ? 'theme-icon-filter opacity-100 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'theme-icon-filter opacity-50'
                        }`} 
                        onError={(e) => { e.currentTarget.src = "/plug.png"; }} 
                    />
                </div>
                <div className="flex flex-col">
                    <div className={`text-sm font-bold tracking-tight capitalize truncate w-24 sm:w-28 ${
                        isOn ? 'theme-text-primary' : 'theme-text-secondary'
                    }`}>{device.name}</div>
                    <div className="flex items-center space-x-1.5 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isOn ? 'bg-cyan-500 animate-pulse' : 'bg-gray-400'}`} />
                        <span className="theme-text-tertiary text-[9px] font-bold uppercase tracking-wider">{isOn ? 'Active' : 'Offline'}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-between h-full items-end pt-1">
                <div
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${
                        isOn ? 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    onClick={handleToggle}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                            isOn ? 'translate-x-6' : 'translate-x-0'
                        }`}
                    ></div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] theme-text-tertiary font-bold uppercase tracking-tighter mb-1 opacity-50">Current Load</div>
                    <div className="text-base bg-gradient-to-r from-cyan-500 to-blue-500 font-black bg-clip-text text-transparent">
                        {Number(device.power_consumption).toFixed(2)}<span className="text-[10px] ml-0.5">kW</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


const UsageStats: React.FC = () => {
    const [selectedRange, setSelectedRange] = useState('Today');
    return (
        <div className="w-full h-full theme-bg-secondary rounded-[2.5rem] theme-shadow-strong p-8 flex flex-col theme-border border relative group transition-all duration-300 hover:border-cyan-500/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-colors"></div>
            <div className="flex justify-between items-center mb-8 relative z-50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <img src="/nav/history.png" className="w-5 h-5 theme-icon-filter" alt="stats" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold theme-text-primary uppercase tracking-wider">Usage Status</h1>
                        <p className="text-[10px] theme-text-tertiary font-medium">Power consumption metrics</p>
                    </div>
                </div>
                <TimeRangeDropdown selected={selectedRange} setSelected={setSelectedRange}/>
            </div>
            <div className="flex-1 min-h-[170px] relative z-10">
                <TemperatureChart selectedRange={selectedRange}/>
            </div>
        </div>
    );
};

const Appliances: React.FC = () => (
    <div className="w-full h-full theme-bg-secondary rounded-[2.5rem] theme-border border theme-shadow-strong p-8 flex flex-col group hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
        <div className="flex items-center space-x-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <img src="/nav/settings.png" className="w-5 h-5 theme-icon-filter" alt="appliances" />
            </div>
            <div>
                <h1 className="text-sm font-bold theme-text-primary uppercase tracking-wider">Quick Controls</h1>
                <p className="text-[10px] theme-text-tertiary font-medium">Manage primary systems</p>
            </div>
        </div>
        <div className="flex-1 relative z-10">
            <ApplianceControlCard/>
        </div>
    </div>
);

const PowerConsumption: React.FC<{ devices: Device[] }> = ({ devices }) => {
    const totalPower = devices.reduce((acc, d) => acc + Number(d.power_consumption), 0);
    
    return (
        <div className="w-full h-full theme-bg-secondary rounded-[2.5rem] p-8 theme-border border theme-shadow-strong flex flex-col space-y-6 group hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl -mr-16 -mb-16 group-hover:bg-cyan-500/10 transition-colors"></div>
            
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <img src="/plug.png" className="w-5 h-5 theme-icon-filter" alt="power" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold theme-text-primary uppercase tracking-wider">Power Demand</h3>
                        <p className="text-[10px] theme-text-tertiary font-medium">Real-time consumption</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-black text-cyan-500">{totalPower.toFixed(2)} <span className="text-[10px] text-gray-400">kW</span></div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 max-h-[220px] relative z-10 pr-2">
                {devices.length === 0 && <div className="text-sm theme-text-secondary text-center py-4">No devices found</div>}
                {devices.map((device) => {
                    const consumption = Number(device.power_consumption);
                    const percentage = totalPower > 0 ? (consumption / totalPower) * 100 : 0;
                    
                    return (
                        <div key={device.id} className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${device.is_on ? 'bg-cyan-500/10' : 'theme-bg-tertiary'}`}>
                                        <img src={`/${device.icon_name || 'plug'}.png`} alt={device.name} className={`w-4 h-4 object-contain theme-icon-filter ${device.is_on ? 'opacity-100' : 'opacity-40'}`} onError={(e) => { e.currentTarget.src = "/plug.png"; }} />
                                    </div>
                                    <h4 className={`text-xs font-bold truncate w-24 sm:w-32 ${device.is_on ? 'theme-text-primary' : 'theme-text-tertiary'}`}>{device.name}</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black theme-text-primary">{consumption.toFixed(3)} kW</span>
                                </div>
                            </div>
                            <div className="h-1.5 w-full theme-bg-tertiary rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${device.is_on ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'bg-gray-400 dark:bg-gray-700'}`}
                                    style={{ width: `${device.is_on ? percentage : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Occupant: React.FC = () => {
    const { user } = useAuth();
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    
    // In a production environment, this would be fetched from a /members or /family endpoint
    // For now, we show the current user and placeholders for other potential family members
    const occupants = [
        { 
            id: 'owner', 
            name: user?.name || "Owner", 
            role: "Owner", 
            imgSrc: user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b5cf6&color=fff&bold=true`, 
            active: true 
        }
    ];

    return (
        <div className="w-full h-full theme-bg-secondary rounded-[2.5rem] p-8 theme-border border theme-shadow-strong flex flex-col group hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors"></div>
            
            <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <img 
                            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b5cf6&color=fff&bold=true`} 
                            className="w-6 h-6 rounded-full object-cover" 
                            alt="occupant" 
                        />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold theme-text-primary uppercase tracking-wider">Occupancy</h1>
                        <p className="text-[10px] theme-text-tertiary font-medium">Currently at home</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsManageModalOpen(true)}
                    className="text-[10px] font-black theme-text-secondary uppercase tracking-widest hover:text-purple-500 transition-colors"
                >
                    Manage →
                </button>
            </div>

            <div className="grid grid-cols-4 gap-4 relative z-10">
                {occupants.map((item) => (
                    <div key={item.id} className="flex flex-col items-center group/item cursor-pointer">
                        <div className="relative mb-2">
                             <img src={item.imgSrc} alt={item.name} className="w-14 h-14 rounded-2xl object-cover theme-border border transition-transform group-hover/item:scale-105" />
                             {item.active && (
                                 <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full shadow-lg"></span>
                             )}
                        </div>
                        <h4 className="text-[10px] font-bold theme-text-primary truncate w-full text-center">{item.name}</h4>
                        <span className="text-[8px] font-medium theme-text-tertiary uppercase tracking-tighter">{item.role}</span>
                    </div>
                ))}
                
                {/* Placeholders for new users */}
                <div 
                    className="flex flex-col items-center group/btn cursor-pointer"
                    onClick={() => setIsManageModalOpen(true)}
                >
                    <div className="w-14 h-14 theme-bg-tertiary rounded-2xl flex items-center justify-center border border-dashed theme-border group-hover/btn:theme-bg-primary transition-all">
                        <span className="text-xl font-light theme-text-secondary group-hover/btn:scale-125 transition-transform">+</span>
                    </div>
                    <h4 className="text-[10px] font-bold theme-text-tertiary mt-2">Invite</h4>
                </div>
                
                <div className="flex flex-col items-center opacity-40 grayscale pointer-events-none hidden sm:flex">
                    <div className="w-14 h-14 theme-bg-tertiary rounded-2xl flex items-center justify-center border border-dashed theme-border">
                    </div>
                    <span className="text-[8px] font-medium theme-text-tertiary mt-2 uppercase">Empty</span>
                </div>
            </div>

            {/* Manage Members Modal */}
            {isManageModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setIsManageModalOpen(false)} />
                    <div className="relative theme-card-bg w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border theme-border animate-in zoom-in duration-300">
                        <div className="text-center space-y-2 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto text-purple-500 text-2xl font-bold border border-purple-500/20">
                                👥
                            </div>
                            <h3 className="text-xl font-bold theme-text-primary">Manage Ecosystem</h3>
                            <p className="text-sm theme-text-secondary">
                                Invite members and assign access levels.
                            </p>
                        </div>
                        
                        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center mb-6">
                            <span className="text-xl mb-2 block">🚧</span>
                            <h4 className="text-sm font-bold theme-text-primary mb-1">Coming Soon</h4>
                            <p className="text-xs theme-text-secondary">This feature is currently under active development. You will soon be able to invite your family members via email.</p>
                        </div>

                        <button
                            onClick={() => setIsManageModalOpen(false)}
                            className="w-full py-4 rounded-2xl theme-bg-tertiary theme-text-secondary font-bold text-lg hover:opacity-80 transition-all border theme-border"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const HumidityControl: React.FC<{ value: number, onChange: (val: number) => void }> = ({ value, onChange }) => {
    return (
        <div className="pt-8 space-y-6 w-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <img src="/nav/room.png" className="w-5 h-5 theme-icon-filter" alt="humidity" />
                    </div>
                    <h3 className="text-sm font-bold theme-text-primary uppercase tracking-wider">Humidity</h3>
                </div>
                <span className="text-2xl font-black text-cyan-500">{value}%</span>
            </div>

            <div className="relative w-full group">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 theme-bg-tertiary rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300" 
                        style={{ width: `${value}%` }}
                    ></div>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="relative z-10 w-full h-8 appearance-none bg-transparent cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6
                        [&::-webkit-slider-thumb]:rounded-xl
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:border-4
                        [&::-webkit-slider-thumb]:border-cyan-500
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:shadow-cyan-500/30
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:hover:scale-110"
                />
            </div>

            <div className="flex justify-between items-center space-x-3 pb-2">
                {[30, 60, 90].map((preset) => (
                    <button
                        key={preset}
                        onClick={() => onChange(preset)}
                        className={`flex-1 h-12 rounded-2xl font-bold text-xs transition-all duration-300 ${
                            value === preset 
                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                            : 'theme-bg-tertiary theme-text-secondary hover:theme-bg-primary'
                        }`}
                    >
                        {preset === 30 ? 'Low' : preset === 60 ? 'Auto' : 'High'} ({preset}%)
                    </button>
                ))}
            </div>
        </div>
    );
};

const TemperatureControl: React.FC<{ value: number, isOn: boolean, onChange: (val: number) => void }> = ({ value, isOn, onChange }) => {
    const [mode, setMode] = useState('Heating');
    const rotation = ((value - 10) / 20) * 180 - 90;
    const handleTemperatureChange = (delta: number) => onChange(Math.min(Math.max(value + delta, 10), 30));
    
    // Mode-specific styling
    const getModeColor = () => {
        if (!isOn) return 'bg-gray-400';
        switch (mode) {
            case 'Cooling': return 'bg-blue-500';
            case 'Dry': return 'bg-emerald-500';
            case 'Heating':
            default: return 'bg-orange-500';
        }
    };

    const getModeShadow = () => {
        if (!isOn) return '';
        switch (mode) {
            case 'Cooling': return 'shadow-[0_0_15px_rgba(59,130,246,0.4)]';
            case 'Dry': return 'shadow-[0_0_15px_rgba(16,185,129,0.4)]';
            case 'Heating':
            default: return 'shadow-[0_0_15px_rgba(249,115,22,0.4)]';
        }
    };

    const getActiveColor = () => {
        if (!isOn) return 'bg-gray-300 dark:bg-gray-700';
        switch (mode) {
            case 'Cooling': return 'bg-cyan-500';
            case 'Dry': return 'bg-emerald-500';
            case 'Heating':
            default: return 'bg-orange-500';
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex justify-between w-full mb-8">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isOn ? (mode === 'Cooling' ? 'bg-blue-500/10' : mode === 'Dry' ? 'bg-emerald-500/10' : 'bg-orange-500/10') : 'theme-bg-tertiary'}`}>
                        <img 
                            src={`/${mode.toLowerCase()}.png`} 
                            className={`w-5 h-5 theme-icon-filter transition-all duration-500 ${isOn ? 'opacity-100' : 'opacity-30'}`} 
                            alt="temp" 
                        />
                    </div>
                    <h3 className="text-sm font-bold theme-text-primary uppercase tracking-wider">Climate Control</h3>
                </div>
                <div className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center transition-all ${
                    isOn 
                    ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600' 
                    : 'bg-gray-100 dark:theme-bg-tertiary border-transparent theme-text-tertiary'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isOn ? 'bg-cyan-500 animate-pulse' : 'bg-gray-400'}`}></span>
                    {isOn ? 'Running' : 'Standby'}
                </div>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center p-4">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 animate-[spin_60s_linear_infinite]"></div>
                <div className="relative w-full h-full rounded-full theme-bg-secondary shadow-2xl theme-shadow theme-border border-4 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-4 rounded-full border border-gray-100 dark:border-gray-800 shadow-inner"></div>
                    <div className="absolute inset-0">
                        {Array.from({ length: 41 }, (_, i) => {
                            const angle = (i * 180) / 40 - 90;
                            const isActive = ((value - 10) / 20) * 40 >= i;
                            return (
                                <div
                                    key={i}
                                    className={`absolute left-1/2 top-4 w-[2px] h-3 -translate-x-1/2 origin-[50%_110px] transition-all duration-300 ${
                                        isActive ? `${getActiveColor()} h-4 scale-y-110 shadow-[0_0_8px_rgba(6,182,212,0.6)]` : 'bg-gray-300 dark:bg-gray-700'
                                    }`}
                                    style={{ transform: `rotate(${angle}deg)` }}
                                />
                            );
                        })}
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <span className="text-xs font-bold theme-text-tertiary uppercase tracking-widest mb-1">{mode}</span>
                        <div className="flex items-start">
                            <span className="text-6xl font-black theme-text-primary tracking-tighter">{value}</span>
                            <span className="text-2xl font-bold text-cyan-500 mt-1">°</span>
                        </div>
                        <div className="flex items-center mt-2 space-x-1">
                            <img src="/leaf.png" className="w-3.5 h-3.5 opacity-60" alt="eco" />
                            <span className="text-[10px] theme-text-tertiary font-bold uppercase tracking-tight">Eco Mode Active</span>
                        </div>
                    </div>
                    <div className={`absolute inset-0 w-full h-full pointer-events-none transition-transform duration-700 ease-out ${isOn ? 'opacity-100' : 'opacity-20'}`} style={{ transform: `rotate(${rotation}deg)` }}>
                        <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-lg shadow-xl flex items-center justify-center border-2 border-white transition-colors ${getModeColor()} ${getModeShadow()}`}>
                            <div className={`w-1 h-1 rounded-full bg-white ${isOn ? 'animate-pulse' : ''}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-8 mt-10">
                <button onClick={() => handleTemperatureChange(-1)} disabled={!isOn} className={`w-12 h-12 rounded-2xl theme-bg-tertiary flex items-center justify-center text-2xl font-bold theme-text-primary hover:theme-bg-primary transition-all active:scale-95 theme-shadow theme-border ${!isOn ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}`}>
                    <span className="opacity-50">-</span>
                </button>
                <div className="flex flex-col items-center">
                    <div className={`flex space-x-4 transition-opacity ${isOn ? 'opacity-100' : 'opacity-40'}`}>
                        {['Heating', 'Cooling', 'Dry'].map((m) => (
                            <button key={m} onClick={() => isOn && setMode(m)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${mode === m && isOn ? (m === 'Cooling' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/10' : m === 'Dry' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/10' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 ring-4 ring-orange-500/10') : 'theme-bg-tertiary theme-text-tertiary filter grayscale'}`}>
                                <img src={`/${m.toLowerCase()}.png`} className="w-5 h-5 theme-icon-filter" alt={m} />
                            </button>
                        ))}
                    </div>
                </div>
                <button onClick={() => handleTemperatureChange(1)} disabled={!isOn} className={`w-12 h-12 rounded-2xl theme-bg-tertiary flex items-center justify-center text-2xl font-bold theme-text-primary hover:theme-bg-primary transition-all active:scale-95 theme-shadow theme-border ${!isOn ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}`}>
                    <span className="opacity-50">+</span>
                </button>
            </div>
        </div>
    );
};

const AirQuality: React.FC<{ co2: number, pollutant: number }> = ({ co2, pollutant }) => {
    return (
        <div className="space-y-6 pt-4">
            <div className="flex justify-between items-center px-1">
                <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="text-[10px] font-black theme-text-tertiary uppercase tracking-[0.2em]">Air Filtration</h3>
                </div>
                <div className="bg-amber-500/10 px-2 py-0.5 rounded-md text-amber-600 text-[9px] font-black uppercase">Moderate</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="group theme-bg-tertiary p-5 rounded-3xl theme-border border flex flex-col justify-between transition-all hover:border-emerald-500/30 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <img src="/molecules.png" className="w-5 h-5 theme-icon-filter" alt="co2" onError={(e) => e.currentTarget.src = "/air-quality.png"} />
                        </div>
                        <div className="text-[10px] font-black text-emerald-500">CO2</div>
                    </div>
                    <div className="mt-4 relative z-10">
                        <div className="flex items-baseline space-x-1">
                            <span className="text-2xl font-black theme-text-primary tracking-tighter">{co2}</span>
                            <span className="text-[9px] font-bold theme-text-tertiary uppercase tracking-widest">ppm</span>
                        </div>
                        <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-emerald-500 w-3/4 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                        </div>
                    </div>
                </div>
                <div className="group theme-bg-tertiary p-5 rounded-3xl theme-border border flex flex-col justify-between transition-all hover:border-blue-500/30 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <img src="/virus.png" className="w-5 h-5 theme-icon-filter" alt="pm" />
                        </div>
                        <div className="text-[10px] font-black text-blue-500">PM2.5</div>
                    </div>
                    <div className="mt-4 relative z-10">
                        <div className="flex items-baseline space-x-1">
                            <span className="text-2xl font-black theme-text-primary tracking-tighter">{pollutant}</span>
                            <span className="text-[9px] font-bold theme-text-tertiary uppercase tracking-widest">aqi</span>
                        </div>
                        <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-blue-500 w-1/4 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClimateZoneController: React.FC<{ devices: any[], updateDeviceValue: any, toggleDevice: any, envTemp: number }> = ({ devices, updateDeviceValue, toggleDevice, envTemp }) => {
    const [selectedId, setSelectedId] = useState(devices[0]?.id);
    const selectedDevice = devices.find(d => d.id === selectedId) || devices[0];
    const currentTemp = selectedDevice ? Math.round(selectedDevice.value) : 22;

    if (devices.length === 0 || !selectedDevice) return null;

    return (
        <div className="space-y-6">
            {devices.length > 1 && (
                <div className="flex justify-center mb-4">
                    <select 
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="bg-transparent border theme-border theme-text-primary text-xs font-bold rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all appearance-none cursor-pointer pr-10 relative"
                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                    >
                        {devices.map(d => (
                            <option key={d.id} value={d.id} className="theme-bg-secondary">{d.name} ({d.room_name})</option>
                        ))}
                    </select>
                </div>
            )}
            <TemperatureControl 
                value={currentTemp} 
                isOn={selectedDevice?.is_on || false}
                onChange={(val) => {
                    if (selectedDevice) {
                        updateDeviceValue(selectedDevice.id, val);
                        if (!selectedDevice.is_on) toggleDevice(selectedDevice.id);
                    }
                }}
            />
            <div className="flex justify-center">
                <span className="text-[10px] font-bold theme-text-tertiary uppercase tracking-widest bg-gray-100 dark:bg-gray-800/10 px-4 py-1.5 rounded-full border theme-border shadow-sm">
                    Indoor Ambient: {Math.round(envTemp)}°C
                </span>
            </div>
        </div>
    );
};

const HumidityZoneController: React.FC<{ devices: any[], updateDeviceValue: any, toggleDevice: any, envHumidity: number }> = ({ devices, updateDeviceValue, toggleDevice, envHumidity }) => {
    const [selectedId, setSelectedId] = useState(devices[0]?.id);
    const selectedDevice = devices.find(d => d.id === selectedId) || devices[0];
    const currentHumidity = selectedDevice ? Math.round(selectedDevice.value) : 45;

    if (devices.length === 0 || !selectedDevice) return null;

    return (
        <div className="space-y-6">
            {devices.length > 1 && (
                <div className="flex justify-center mt-2">
                    <select 
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="bg-transparent border theme-border theme-text-primary text-xs font-bold rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none transition-all appearance-none cursor-pointer pr-10 relative"
                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                    >
                        {devices.map(d => (
                            <option key={d.id} value={d.id} className="theme-bg-secondary">{d.name} ({d.room_name})</option>
                        ))}
                    </select>
                </div>
            )}
            <HumidityControl 
                value={currentHumidity} 
                onChange={(val) => {
                    if (selectedDevice) {
                        updateDeviceValue(selectedDevice.id, val);
                        if (!selectedDevice.is_on) toggleDevice(selectedDevice.id);
                    }
                }}
            />
            <div className="flex justify-between items-center px-2">
                <span className="text-[9px] font-bold theme-text-tertiary uppercase tracking-widest opacity-60">Sensor Precision</span>
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/20">
                    {Math.round(envHumidity)}% RH
                </span>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { devices, isLoading, error, toggleDevice, updateDeviceValue, refetch: refetchDevices } = useDevices();
    const [envData, setEnvData] = useState({ temperature: 22.5, humidity: 45, co2: 420, pollutant: 20 });
    const [showWelcome, setShowWelcome] = useState(() => localStorage.getItem('homesync_welcomed') !== 'true');

    useSocket({
        onDeviceUpdate: () => refetchDevices(true),
        onDeviceToggle: () => refetchDevices(true),
        onEnvironmentUpdate: (data) => setEnvData(data),
        onPowerUpdate: () => refetchDevices(true)
    });

    if (isLoading && devices.length === 0) {
        return <div className="flex-1 flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (error) {
         return <div className="p-4 bg-red-100 text-red-600 rounded-lg">{error}</div>;
    }

    return (
        <>
        <WelcomeModal isOpen={showWelcome} onDismiss={() => { setShowWelcome(false); localStorage.setItem('homesync_welcomed', 'true'); }} />
        <div className="flex flex-col xl:flex-row gap-8 w-full pb-10">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-black theme-text-primary tracking-tighter uppercase">My Ecosystem</h1>
                    <div className="text-[10px] font-bold theme-text-tertiary bg-cyan-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-500/20">
                         System: <span className="text-cyan-600">Active</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devices.length > 0 ? (
                        devices.map(device => (
                            <DeviceCard 
                                key={device.id} 
                                device={device} 
                                onToggle={toggleDevice} 
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 theme-bg-secondary rounded-[2.5rem] border-2 border-dashed theme-border theme-text-secondary">
                             <div className="flex flex-col items-center">
                                 <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                                     <img src="/plug.png" className="w-8 h-8 opacity-20 grayscale" alt="none" />
                                 </div>
                                 <p className="font-bold">No active nodes detected</p>
                                 <p className="text-xs opacity-60 mt-1">Populate seeds to view system metrics</p>
                             </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                    <div className="h-[400px]">
                        <UsageStats />
                    </div>
                    <div className="h-[400px]">
                        <Appliances />
                    </div>
                    <div className="lg:col-span-1 h-[420px]">
                        <PowerConsumption devices={devices} />
                    </div>
                    <div className="lg:col-span-1 h-[420px]">
                        <Occupant />
                    </div>
                </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="w-full xl:w-[400px] xl:min-w-[400px]">
                <div className="theme-bg-secondary theme-border border theme-shadow-strong rounded-[2.5rem] p-8 sticky top-8 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/5 overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[100px] group-hover:bg-cyan-500/15 transition-colors"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 blur-[80px] group-hover:bg-blue-500/10 transition-colors"></div>
                    
                    <div className="relative z-10 space-y-12">
                        {(() => {
                            const climateDevices = devices.filter(d => d.type === 'thermostat' || d.type === 'ac' || d.name.toLowerCase().includes('condition'));
                            return <ClimateZoneController devices={climateDevices} updateDeviceValue={updateDeviceValue} toggleDevice={toggleDevice} envTemp={envData.temperature} />;
                        })()}

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
                        
                        {(() => {
                            const humidifiers = devices.filter(d => d.type === 'humidifier' || d.name.toLowerCase().includes('humidity'));
                            return <HumidityZoneController devices={humidifiers} updateDeviceValue={updateDeviceValue} toggleDevice={toggleDevice} envHumidity={envData.humidity} />;
                        })()}

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
                        <AirQuality co2={envData.co2} pollutant={envData.pollutant} />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default DashboardPage;
