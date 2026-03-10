import React from 'react';
import { HiLightningBolt, HiBell, HiViewGrid } from 'react-icons/hi';

export const CreativeGraphics: React.FC = () => {
    return (
        <section id="tech" className="py-24 theme-bg-primary overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 relative">
                        {/* Creative Tech Graphics Section */}
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            {/* Central Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 blur-[120px] opacity-20"></div>
                            
                            {/* Tech Ring 1 */}
                            <div className="absolute inset-0 border-[1px] border-cyan-500/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            {/* Tech Ring 2 */}
                            <div className="absolute inset-[15%] border-[2px] border-dashed border-cyan-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                            {/* Tech Ring 3 */}
                            <div className="absolute inset-[30%] border-[4px] border-cyan-500/5 rounded-full"></div>

                            {/* Floating Tech Elements */}
                            <div className="absolute top-[10%] left-[20%] w-16 h-16 theme-card-bg rounded-2xl flex items-center justify-center shadow-xl border theme-border animate-bounce-slow">
                                <HiLightningBolt className="w-8 h-8 text-cyan-500" />
                            </div>
                            <div className="absolute bottom-[20%] left-[10%] w-20 h-20 theme-card-bg rounded-3xl flex items-center justify-center shadow-xl border theme-border animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
                                <HiBell className="w-10 h-10 text-cyan-500" />
                            </div>
                            <div className="absolute top-[40%] right-[0%] w-24 h-24 theme-card-bg rounded-[2rem] flex items-center justify-center shadow-2xl border theme-border animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                                <HiViewGrid className="w-12 h-12 text-cyan-500" />
                            </div>

                            {/* Center Core */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 theme-card-bg rounded-full flex items-center justify-center shadow-2xl border-4 border-cyan-500/20 z-10">
                                <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-cyan-500/40">S</div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8 text-center lg:text-left">
                        <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.4em]">Engineered for Reliability</h2>
                        <h3 className="text-4xl md:text-6xl font-extrabold tracking-tighter theme-text-primary leading-[1.1]">
                            The Future of <br />
                            <span className="text-gray-400">IoT Fabric.</span>
                        </h3>
                        <p className="text-lg theme-text-secondary leading-relaxed max-w-md mx-auto lg:mx-0">
                            Our proprietary synchronization engine handles millions of events per second with absolute data integrity. Built on a serverless-ready architecture for infinite scalability.
                        </p>

                        <div className="grid grid-cols-2 gap-8 pt-6">
                            <div className="space-y-2">
                                <div className="text-2xl font-bold theme-text-primary">99.9%</div>
                                <div className="text-[10px] font-bold theme-text-tertiary uppercase tracking-widest">Uptime SLA</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-2xl font-bold theme-text-primary">150ms</div>
                                <div className="text-[10px] font-bold theme-text-tertiary uppercase tracking-widest">Avg Latency</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-2xl font-bold theme-text-primary">E2E</div>
                                <div className="text-[10px] font-bold theme-text-tertiary uppercase tracking-widest">Encrypted</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-2xl font-bold theme-text-primary">∞</div>
                                <div className="text-[10px] font-bold theme-text-tertiary uppercase tracking-widest">Scalability</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-30px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 5s ease-in-out infinite;
                }
            ` }} />
        </section>
    );
};
