import React from 'react';
import { Link } from 'react-router-dom';

export const CTASection: React.FC = () => {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-[3rem] bg-gradient-to-br from-cyan-600 to-blue-700 p-12 md:p-24 overflow-hidden shadow-2xl shadow-cyan-500/20">
                     <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                         <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white blur-[100px] rounded-full"></div>
                         <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-black blur-[80px] rounded-full"></div>
                     </div>

                     <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
                         <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">
                             Ready to evolve your home experience?
                         </h3>
                         <p className="text-lg text-cyan-100/80 max-w-xl mx-auto">
                             Join thousands of users who have already transformed their living space into an intelligent oasis. Deploy in minutes.
                         </p>
                         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                             <Link 
                                to="/register" 
                                className="w-full sm:w-auto px-10 py-5 rounded-[2rem] bg-white text-cyan-600 font-black text-xl hover:scale-105 transition-transform"
                             >
                                Get Control Now
                             </Link>
                             <button className="w-full sm:w-auto px-10 py-5 rounded-[2rem] border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-colors">
                                View Demo Hub
                             </button>
                         </div>
                     </div>
                </div>
            </div>
        </section>
    );
};

export const LandingFooter: React.FC = () => {
    return (
        <footer className="footer-bg pt-20 pb-10 border-t theme-border theme-bg-secondary">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <div className="flex items-center space-x-2">
                             <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-bold text-lg">H</div>
                             <span className="text-xl font-bold tracking-tight theme-text-primary">HomeSync</span>
                        </div>
                        <p className="text-sm theme-text-tertiary leading-relaxed">
                            Pioneering the next generation of smart home management systems through high-fidelity digital twins.
                        </p>
                        <div className="flex space-x-4">
                             {['tw', 'fb', 'ig', 'li'].map(social => (
                                 <div key={social} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold theme-text-secondary hover:bg-cyan-500 hover:text-white transition-all cursor-pointer uppercase">{social}</div>
                             ))}
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold theme-text-primary uppercase tracking-wider">Product</h4>
                        <ul className="space-y-3">
                            {['Overview', 'Features', 'Analytics', 'Energy Saving', 'Security'].map(item => (
                                <li key={item}><a href="#" className="text-sm theme-text-secondary hover:text-cyan-500 transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-bold theme-text-primary uppercase tracking-wider">Resources</h4>
                        <ul className="space-y-3">
                            {['API Documentation', 'IoT Protocol', 'Community Hub', 'Help Center', 'Developer SDK'].map(item => (
                                <li key={item}><a href="#" className="text-sm theme-text-secondary hover:text-cyan-500 transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-bold theme-text-primary uppercase tracking-wider">Join Newsletter</h4>
                        <p className="text-xs theme-text-tertiary">Get the latest IoT updates and energy saving tips directly to your inbox.</p>
                        <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1 border theme-border">
                            <input type="email" placeholder="email@homesync.io" className="bg-transparent flex-1 px-4 py-2 text-xs theme-text-primary outline-none" />
                            <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold">Join</button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t theme-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] font-bold theme-text-tertiary uppercase tracking-widest">
                    <span>© 2026 HomeSync Systems Inc. All rights reserved.</span>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-cyan-500 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-cyan-500 transition-colors">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
