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

            <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 theme-border theme-bg-tertiary overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold theme-text-primary">Joined by 2,400+ Homeowners</span>
                            <div className="flex items-center text-cyan-500 text-xs font-bold">
                                <span>★★★★★</span>
                                <span className="ml-2 theme-text-secondary text-[10px] uppercase tracking-tighter">4.9/5 Average Rating</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative lg:scale-125 transition-transform duration-700 lg:pr-4">
                    <div className="relative z-10 w-full transition-opacity duration-700">
                        <img 
                            src={isDarkMode ? "/landing-hero-dark.png" : "/landing-hero.png"} 
                            alt="HomeSync Hero" 
                            className="w-full h-auto border-0 opacity-90 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"
                        />
                    </div>
                    {/* Floating Cards Mockups */}
                    <div className="absolute -bottom-[5%] -right-[15%] w-48 h-48 theme-card-bg/40 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border theme-border z-20 animate-float" style={{ animationDelay: '1s' }}>
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-4">
                            <img src="/nav/window.png" className="w-5 h-5 brightness-0 invert opacity-60" alt="icon" />
                        </div>
                        <div className="text-xs font-bold theme-text-primary mb-1">Energy Saving</div>
                        <div className="text-lg font-bold text-cyan-500">24.5%</div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-3">
                            <div className="w-3/4 h-full bg-cyan-500 rounded-full"></div>
                        </div>
                    </div>
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
