import React, { useState, useEffect } from 'react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import api from '../services/api.ts';
import type { AnalyticsData } from '../types/index.ts';

const AnalyticsPage: React.FC = () => {
    const [period, setPeriod] = useState<number>(7); // days
    const [data, setData] = useState<AnalyticsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);
            try {
                const res = await api.get(`/sensors/analytics?period=${period}`);
                const serverData = res.data.analytics || [];
                
                // Ensure chart draws by padding empty days with 0 consumption
                const paddedData = [];
                for (let i = period - 1; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split('T')[0];
                    const existing = serverData.find((item: any) => new Date(item.date).toISOString().split('T')[0] === dateStr);
                    paddedData.push({
                        date: dateStr,
                        total_consumption: existing ? Number(Number(existing.total_consumption).toFixed(2)) : 0,
                        reading_count: existing ? Number(existing.reading_count) : 0,
                    });
                }
                
                setData(paddedData);
                setError(null);
            } catch (err: any) {
                if (err.message !== 'Network Error' || !document.location.href.includes('localhost')) {
                   setError(err.response?.data?.error || 'Failed to fetch analytics data');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [period]);

    const totalConsumption = data.reduce((sum, item) => sum + Number(item.total_consumption), 0).toFixed(2);
    const maxConsumption = data.length > 0 ? Math.max(...data.map(d => Number(d.total_consumption))).toFixed(2) : '0';
    const averageConsumption = data.length > 0 ? (Number(totalConsumption) / data.length).toFixed(2) : '0';

    if (isLoading) return <div className="flex-1 flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="flex flex-col h-full w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                     <h1 className="text-xl font-bold theme-text-primary">Energy Analytics</h1>
                     <p className="text-xs theme-text-secondary mt-1">Detailed breakdown of power consumption over time</p>
                </div>
                <select 
                    value={period} 
                    onChange={(e) => setPeriod(Number(e.target.value))}
                    className="theme-bg-tertiary theme-text-primary px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-cyan-500 font-medium cursor-pointer"
                >
                    <option value={7}>7 Days</option>
                    <option value={14}>14 Days</option>
                    <option value={30}>30 Days</option>
                </select>
            </div>

            {error ? (
                <div className="p-4 bg-red-100 text-red-600 rounded-lg">{error}</div>
            ) : data.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center theme-card-bg rounded-3xl min-h-[400px]">
                     <img src="/lightning.png" alt="No Data" className="w-16 h-16 opacity-30 grayscale mb-4" onError={(e) => { e.currentTarget.src = "/plug.png"; }} />
                     <p className="theme-text-secondary">No analytics data available for this period.</p>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                         <div className="theme-card-bg rounded-3xl theme-shadow-strong p-6 flex flex-col justify-between h-[140px] relative overflow-hidden border border-cyan-500/5">
                             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                 <img src="/lightning.png" className="w-16 h-16 theme-icon-filter" alt="icon" onError={(e) => { e.currentTarget.src = "/plug.png"; }} style={{ filter: 'invert(58%) sepia(82%) saturate(3015%) hue-rotate(152deg) brightness(97%) contrast(97%)' }} />
                             </div>
                             <span className="text-[11px] font-bold theme-text-secondary uppercase tracking-wider">Total Power Used</span>
                             <div className="text-2xl font-bold theme-text-primary pb-2">{totalConsumption} <span className="text-sm text-cyan-500 font-semibold">kWh</span></div>
                         </div>
                         <div className="theme-card-bg rounded-3xl theme-shadow-strong p-6 flex flex-col justify-between h-[140px] relative overflow-hidden border border-cyan-500/5">
                             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                 <img src="/avg.png" className="w-16 h-16 theme-icon-filter" alt="icon" onError={(e) => { e.currentTarget.src = "/plug.png"; }} style={{ filter: 'invert(58%) sepia(82%) saturate(3015%) hue-rotate(152deg) brightness(97%) contrast(97%)' }} />
                             </div>
                             <span className="text-[11px] font-bold theme-text-secondary uppercase tracking-wider">Average Daily Used</span>
                             <div className="text-2xl font-bold theme-text-primary pb-2">{averageConsumption} <span className="text-sm text-cyan-500 font-semibold">kWh</span></div>
                         </div>
                         <div className="theme-card-bg rounded-3xl theme-shadow-strong p-6 flex flex-col justify-between h-[140px] relative overflow-hidden border border-cyan-500/5">
                             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                 <img src="/arrow-up.png" className="w-16 h-16 theme-icon-filter" alt="icon" onError={(e) => { e.currentTarget.src = "/plug.png"; }} style={{ filter: 'invert(58%) sepia(82%) saturate(3015%) hue-rotate(152deg) brightness(97%) contrast(97%)' }} />
                             </div>
                             <span className="text-[11px] font-bold theme-text-secondary uppercase tracking-wider">Peak Consumption</span>
                             <div className="text-2xl font-bold theme-text-primary pb-2">{maxConsumption} <span className="text-sm text-cyan-500 font-semibold">kWh</span></div>
                         </div>
                    </div>

                    {/* Chart Area */}
                    <div className="theme-card-bg rounded-3xl theme-shadow-strong p-6 w-full min-h-[400px] flex flex-col">
                        <h2 className="text-lg font-bold theme-text-primary mb-6">Daily Breakdown</h2>
                        <div className="flex-1 w-full relative" style={{ minHeight: '300px' }}>
                            <ResponsiveContainer width="99%" height={300}>
                                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tickFormatter={(dateStr) => {
                                            const d = new Date(dateStr);
                                            return `${d.getDate()}/${d.getMonth()+1}`;
                                        }}
                                        tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
                                    />
                                    <Tooltip 
                                        labelFormatter={(label) => new Date(label).toDateString()}
                                        formatter={(value) => [`${Number(value).toFixed(2)} kWh`, 'Power Usage']}
                                        contentStyle={{
                                            backgroundColor: 'var(--card-bg)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            color: 'var(--text-primary)',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                        itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="total_consumption" 
                                        stroke="#06b6d4" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorUsage)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalyticsPage;
