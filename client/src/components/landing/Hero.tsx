import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useTheme } from '../../contexts/ThemeContext.tsx';

export const Hero: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { isDarkMode } = useTheme();
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden theme-bg-primary">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-50 pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="max-w-[1280px] w-full mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
                        <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Digital Twin Protocol v2.4</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] theme-text-primary">
                        Your Home, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Perfectly Synced </span>
                    </h1>

                    <p className="text-lg theme-text-secondary max-w-lg leading-relaxed">
                        Experience the world's most advanced smart home dashboard. Real-time device synchronization, AI-powered energy insights, and a stunning digital twin interface.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link 
                            to={isAuthenticated ? "/dashboard" : "/register"} 
                            className="px-8 py-4 rounded-2xl bg-cyan-500 text-white font-bold shadow-xl shadow-cyan-500/20 hover:scale-105 hover:shadow-cyan-500/40 transition-all"
                        >
                            {isAuthenticated ? "Back to Dashboard" : "Deploy My Dashboard"}
                        </Link>
                        <a 
                            href="#features" 
                            className="px-8 py-4 rounded-2xl theme-bg-secondary theme-text-primary font-bold shadow-lg hover:opacity-90 transition-all border theme-border"
                        >
                            Explore Intelligence
                        </a>
                    </div>

                    <div className="flex items-center space-x-6 pt-8">
                        <div className="flex -space-x-3">
                            {['sazid.jpg', 'shafayat.jpg', 'jui.jpg', 'sharmin.jpg'].map((img, i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 theme-border theme-bg-tertiary overflow-hidden">
                                    <img src={`/profile/${img}`} alt="user" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold theme-text-primary">Joined by 4,200+ Homeowners</span>
                            <div className="flex items-center text-cyan-500 text-xs font-bold">
                                <span>★★★★★</span>
                                <span className="ml-2 theme-text-secondary text-[10px] uppercase tracking-tighter">4.9/5 Average Rating</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative h-[550px] lg:scale-95 xl:scale-100 transition-transform duration-700">
                    {/* Background Abstract Shapes (MS Style) */}
                    <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-[3rem] border-2 border-dashed theme-border opacity-20 rotate-3 z-0"></div>
                    
                    {/* Main Dashboard Fragment - Central Piece */}
                    <div className="absolute top-[20%] left-[12%] w-[65%] h-[55%] theme-card-bg/60 backdrop-blur-2xl rounded-[3rem] shadow-2xl border theme-border z-10 overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                        <div className="p-8 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold theme-text-primary tracking-tight">Main Hub</h3>
                                    <p className="text-[10px] theme-text-tertiary uppercase tracking-widest font-bold">Digital Twin Active</p>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center pb-6">
                                <div className="relative group/image">
                                    {/* Microsoft/ConsultBook Style Frame */}
                                    <div className="relative w-64 h-52 p-2 rounded-[3.5rem] border-[6px] border-blue-600/80 bg-gray-900 shadow-2xl overflow-hidden transition-all duration-700 group-hover/image:scale-105">
                                        {/* Inner Content with House Mockup */}
                                        <div className="relative w-full h-full rounded-[2.8rem] overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 z-10"></div>
                                            <img 
                                                src="/landing-hero2.png" 
                                                alt="House Mockup" 
                                                className="w-full h-full object-cover brightness-90 group-hover/image:scale-110 transition-transform duration-1000" 
                                            />
                                            
                                            {/* Overlay Status Card (ConsultBook style) */}
                                            <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-3 rounded-2xl shadow-lg z-20 border theme-border transform translate-y-1 group-hover/image:translate-y-0 transition-transform duration-500">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-blue-500/40">
                                                            AI
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] font-bold text-gray-900 dark:text-white">Smart Optimization</div>
                                                            <div className="text-[8px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-tight">System Active</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                                        ONLINE
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Floating Decorative Elements */}
                                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
                                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-cyan-500/10 blur-2xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Environment Fragment - Top Right */}
                    <div className="absolute top-[2%] right-[10%] w-[35%] h-[35%] theme-card-bg/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border theme-border z-20 animate-float" style={{ animationDelay: '0.5s' }}>
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                                </div>
                                <span className="text-xs font-bold theme-text-secondary uppercase">Climate</span>
                            </div>
                            <div className="space-y-3">
                                <div className="text-2xl font-black theme-text-primary">24°C</div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 h-1.5 bg-emerald-500/20 rounded-full overflow-hidden">
                                        <div className="w-2/3 h-full bg-emerald-500"></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-500">OPTIMAL</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appliance Fragment - Bottom Left */}
                    <div className="absolute bottom-[5%] left-[2%] w-[40%] h-[30%] theme-card-bg/90 backdrop-blur-xl rounded-[2.5rem] shadow-xl border theme-border z-20 animate-float" style={{ animationDelay: '1.5s' }}>
                        <div className="p-6 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                </div>
                                <div className="w-10 h-5 bg-cyan-500 rounded-full flex items-center px-0.5">
                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-4"></div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold theme-text-primary tracking-tight">Smart Lighting</h4>
                                <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">75% Intensity</p>
                            </div>
                        </div>
                    </div>

                    {/* Security Pill - Middle Right */}
                    <div className="absolute top-[45%] right-[8%] theme-card-bg/50 backdrop-blur-lg px-6 py-3 rounded-full shadow-lg border theme-border z-30 flex items-center space-x-3 animate-pulse">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[10px] font-black theme-text-primary uppercase tracking-[0.2em]">Security Armed</span>
                    </div>

                    {/* Energy Saving Card (Existing, slightly styled) */}
                    <div className="absolute bottom-[10%] right-[10%] w-[45%] h-[30%] theme-card-bg/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border theme-border z-20 animate-float" style={{ animationDelay: '1s' }}>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                                <img src="/nav/window.png" className="w-5 h-5 brightness-0 invert opacity-60 flex-shrink-0" style={{ filter: isDarkMode ? '' : 'brightness(0)' }} alt="icon" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold theme-text-tertiary uppercase tracking-widest leading-none">Efficiency</div>
                                <div className="text-xs font-black theme-text-primary tracking-tight">Energy Saving</div>
                            </div>
                        </div>
                        <div className="text-3xl font-black text-cyan-500 mb-4 tracking-tighter">24.5%</div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)]"></div>
                        </div>
                    </div>

                    {/* Abstract Decorative Frame */}
                    <div className="absolute -bottom-[5%] right-[25%] w-[25%] h-[20%] rounded-[2rem] border-2 border-dashed theme-border opacity-30 z-0 rotate-12"></div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            ` }} />
        </section>
    );
};
