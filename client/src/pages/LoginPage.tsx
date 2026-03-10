import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import api from '../services/api.ts';
import { useTheme } from '../contexts/ThemeContext.tsx';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
            // Try demo fallback if backend isn't ready
            if (!err.response && email === 'demo@homesync.app') {
                console.log('Backend not reachable, using demo mode');
                login('demo-token', {
                    id: '1', name: 'Demo User', email: 'demo@homesync.app',
                    avatar_url: '/profile.jpg', theme_preference: isDarkMode ? 'dark' : 'light'
                });
                navigate('/dashboard');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex theme-bg-primary overflow-hidden">
            {/* Left Side: Visuals (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0a0a0c]">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/auth-graphic.png" 
                        alt="Security Visual" 
                        className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />
                </div>
                
                <div className="relative z-10 flex flex-col justify-between p-16 w-full">
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity w-fit">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">H</div>
                        <span className="text-2xl font-bold tracking-tight text-white">HomeSync</span>
                    </Link>

                    <div className="space-y-6">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Security Tier</span>
                        </div>
                        <h2 className="text-5xl font-bold text-white leading-tight">
                            The Future of <br />
                            <span className="text-cyan-500">Secure Living.</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                            Log in to access your digital twin dashboard and manage your ecosystem with military-grade encryption.
                        </p>
                    </div>

                    <div className="flex items-center space-x-4 text-white/40 text-xs">
                        <span>Protected by HS-Core v2.4</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Real-time Sync Active</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                {/* Decorative background for mobile/light mode */}
                <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right duration-700">
                    <div className="text-center lg:text-left space-y-2">
                        <h1 className="text-3xl font-bold theme-text-primary tracking-tight">Welcome Back</h1>
                        <p className="text-sm theme-text-secondary">Enter your credentials to manage your smart home.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold theme-text-secondary uppercase tracking-wider ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl theme-bg-tertiary theme-text-primary border theme-border focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-gray-500/50"
                                placeholder="name@homesync.app"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold theme-text-secondary uppercase tracking-wider">Password</label>
                                <a href="#" className="text-[10px] text-cyan-500 font-bold hover:underline">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl theme-bg-tertiary theme-text-primary border theme-border focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-gray-500/50"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center mt-4 bg-cyan-500 hover:bg-cyan-400"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : 'Sign In to Dashboard'}
                        </button>
                    </form>

                    <div className="pt-6 border-t theme-border text-center">
                        <p className="text-sm theme-text-secondary">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-cyan-500 hover:underline">
                                Create HS-ID Free
                            </Link>
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 text-center">
                        <p className="text-[10px] theme-text-tertiary uppercase tracking-[0.2em] mb-2 font-bold opacity-60">Developer Sandbox Mode</p>
                        <div className="flex justify-center space-x-4 text-xs font-medium">
                            <code className="theme-text-primary opacity-80">demo@homesync.app</code>
                            <code className="theme-text-primary opacity-80">password123</code>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.6; transform: scale(1.05); }
                    50% { opacity: 0.4; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 20s ease-in-out infinite;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
            ` }} />
        </div>
    );
};

export default LoginPage;
