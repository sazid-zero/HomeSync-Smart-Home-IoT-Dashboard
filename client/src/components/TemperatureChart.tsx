import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import React, { useEffect, useState } from "react";
import api from '../services/api.ts';

type TemperatureChartProps = {
    selectedRange: string;
};

type AnalyticsData = {
    time: string;
    usage: number;
};

const TemperatureChart: React.FC<TemperatureChartProps> = ({ selectedRange }) => {
    const [data, setData] = useState<AnalyticsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);
            try {
                const period = selectedRange === 'This Week' ? 'weekly' : selectedRange === 'This Month' ? 'monthly' : 'daily';
                const res = await api.get(`/sensors/analytics?period=${period}`);
                
                const { analytics } = res.data;
                if (Array.isArray(analytics)) {
                    const formattedData = analytics.map((item: any) => {
                        const date = new Date(item.date);
                        let label = item.date;
                        
                        if (period === 'daily') {
                            // Hour: 08:00
                            label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        } else {
                            // Day: Mon, 12 Mar
                            label = date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
                        }

                        return {
                            time: label,
                            usage: Number(item.total_consumption) || 0
                        };
                    });
                    setData(formattedData);
                }
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [selectedRange]);

    // Max value for highlighting
    const maxUsage = data.length > 0 ? Math.max(...data.map((d) => d.usage)) : 0;
    const totalUsage = data.reduce((sum, d) => sum + d.usage, 0).toFixed(2);
    const totalHours = data.length;

    if (isLoading && data.length === 0) {
        return (
            <div className="w-full h-[240px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-full theme-card-bg rounded-2xl p-3 md:p-4">
            <div className="flex justify-start gap-3 md:gap-6 items-center mb-3">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold theme-text-secondary uppercase">Total Spend</span>
                    <span className="theme-text-primary text-sm font-bold">{totalUsage} kW</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold theme-text-secondary uppercase">Total Units</span>
                    <span className="theme-text-primary text-sm font-bold">{totalHours} pts</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold theme-text-secondary uppercase">Highest Usage</span>
                    <span className="theme-text-primary text-sm font-bold">{maxUsage} kW</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 600 }}
                    />
                    <YAxis hide domain={[0, 'dataMax + 1']} />
                    <Tooltip
                        formatter={(value) => [`${value} kW`, 'Usage']}
                        cursor={{ fill: 'var(--shadow-color)' }}
                        contentStyle={{
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <Bar dataKey="usage" barSize={16}>
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry.usage === maxUsage && maxUsage > 0 ? 'var(--text-primary)' : 'var(--border-color)'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TemperatureChart;
