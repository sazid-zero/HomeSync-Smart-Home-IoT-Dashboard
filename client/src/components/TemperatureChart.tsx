
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
import React from "react";

type TemperatureChartProps = {
    selectedRange: string;
};

// ✅ Mock data
const dataToday = [
    { time: '9.00', usage: 2.1 },
    { time: '10.00', usage: 2.3 },
    { time: '11.00', usage: 2.8 },
    { time: '12.00', usage: 3.0 },
    { time: '13.00', usage: 3.5 },
    { time: '14.00', usage: 2.9 },
    { time: '15.00', usage: 2.7 },
    { time: '16.00', usage: 3.2 },
    { time: '17.00', usage: 2.4 },
    { time: '18.00', usage: 3.1 },
    { time: '19.00', usage: 2.8 }
];

const dataWeek = [
    { time: 'Mon', usage: 25 },
    { time: 'Tue', usage: 22 },
    { time: 'Wed', usage: 30 },
    { time: 'Thu', usage: 28 },
    { time: 'Fri', usage: 26 },
    { time: 'Sat', usage: 24 },
    { time: 'Sun', usage: 27 }
];

const dataMonth = [
    { time: 'Week 1', usage: 150 },
    { time: 'Week 2', usage: 165 },
    { time: 'Week 3', usage: 140 },
    { time: 'Week 4', usage: 175 }
];

// ✅ Component
const TemperatureChart: React.FC<TemperatureChartProps> = ({ selectedRange }) => {
    // Choose data based on range
    const data =
        selectedRange === 'This Week'
            ? dataWeek
            : selectedRange === 'This Month'
                ? dataMonth
                : dataToday;

    // Max value for highlighting
    const maxUsage = Math.max(...data.map((d) => d.usage));

    // Total kW usage
    const totalUsage = data.reduce((sum, d) => sum + d.usage, 0).toFixed(2);

    // Total hours (or days/weeks depending on range)
    const totalHours = data.length;

    return (
        <div className="w-full h-full theme-card-bg rounded-2xl p-3 md:p-4">
            <div className="flex justify-start gap-3 md:gap-6 items-center mb-3">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold theme-text-secondary uppercase">Total Spend</span>
                    <span className="theme-text-primary text-sm font-bold">{totalUsage} kW</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold theme-text-secondary uppercase">Total Hours</span>
                    <span className="theme-text-primary text-sm font-bold">{totalHours} h</span>
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
                    <YAxis domain={[2,4]} hide />
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
                                fill={entry.usage === maxUsage ? 'var(--text-primary)' : 'var(--border-color)'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TemperatureChart;
