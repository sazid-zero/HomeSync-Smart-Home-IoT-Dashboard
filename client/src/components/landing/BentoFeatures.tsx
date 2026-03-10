import React from 'react';

export const BentoFeatures: React.FC = () => {
    return (
        <section id="features" className="py-24 theme-bg-secondary">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.3em]">Modern Intelligence</h2>
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight theme-text-primary">
                        Everything you need to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">master your environment.</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-4 h-[800px] md:h-[600px]">
                    {/* Big Bento Item */}
                    <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] theme-bg-tertiary border theme-border">
                        <div className="absolute inset-0 z-0 opacity-80 group-hover:scale-105 transition-transform duration-700">
                            <img src="/bento-iot.png" alt="Features" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                        <div className="absolute bottom-10 left-10 right-10 z-20 space-y-2">
                            <h4 className="text-2xl font-bold text-white">Advanced Digital Twin</h4>
                            <p className="text-sm text-gray-300 max-w-md">Our high-fidelity replication engine ensures your dashboard matches your reality with millisecond precision.</p>
                        </div>
                    </div>

                    {/* Small Bento Item 1 */}
                    <div className="md:col-span-1 md:row-span-1 theme-card-bg border theme-border rounded-[2.5rem] p-8 flex flex-col justify-between group hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/30 blur-[40px] -mr-12 -mb-12 group-hover:bg-cyan-500/50 transition-colors"></div>
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                            <img src="/nav/room.png" className="w-6 h-6 theme-icon-filter" alt="icon" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold theme-text-primary mb-2">Room Partitioning</h4>
                            <p className="text-xs theme-text-secondary leading-relaxed">Organize devices by floors, zones, or individual rooms for intuitive management.</p>
                        </div>
                    </div>

                    {/* Small Bento Item 2 */}
                    <div className="md:col-span-1 md:row-span-1 border theme-border rounded-[2.5rem] p-8 flex flex-col justify-between group hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-purple-500/[0.03] to-transparent dark:from-purple-500/[0.08]">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/30 blur-[40px] -mr-12 -mb-12 group-hover:bg-purple-500/50 transition-colors"></div>
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                            <img src="/nav/history.png" className="w-6 h-6 theme-icon-filter" alt="icon" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold theme-text-primary mb-2">Energy Forensics</h4>
                            <p className="text-xs theme-text-secondary leading-relaxed">Track consumption spikes and get granular breakdowns of appliance efficiency.</p>
                        </div>
                    </div>

                    {/* Horizontal Item */}
                    <div className="md:col-span-2 md:row-span-1 border theme-border rounded-[2.5rem] p-8 flex items-center space-x-8 group hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-blue-500/[0.03] via-transparent to-transparent dark:from-blue-500/[0.08]">
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/30 blur-[60px] -mr-20 -mb-20 group-hover:bg-blue-500/50 transition-colors"></div>
                        <div className="flex-1 space-y-2 relative z-10">
                             <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Automation</div>
                             <h4 className="text-xl font-bold theme-text-primary">Smart Protocols</h4>
                             <p className="text-xs theme-text-secondary">Set complex schedules and automatic triggers based on sensor thresholds or ambient data.</p>
                        </div>
                        <div className="w-32 h-32 bg-blue-500/5 rounded-3xl overflow-hidden relative group-hover:scale-105 transition-transform z-10">
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500 blur-[40px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                             <div className="absolute inset-0 flex items-center justify-center p-4">
                                <img src="/nav/settings.png" className="w-full h-full object-contain theme-icon-filter opacity-40 group-hover:opacity-60 transition-opacity" alt="icon" />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
