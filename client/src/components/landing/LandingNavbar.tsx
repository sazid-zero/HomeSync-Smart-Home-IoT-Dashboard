import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useTheme } from '../../contexts/ThemeContext.tsx';

export const LandingNavbar: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled 
            ? 'py-4 theme-card-bg/80 backdrop-blur-xl border-b theme-border shadow-lg' 
            : 'py-6 bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">H</div>
                    <span className="text-xl font-bold tracking-tight theme-text-primary">HomeSync</span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-sm font-medium theme-text-secondary hover:text-cyan-500 transition-colors">Features</a>
                    <a href="#tech" className="text-sm font-medium theme-text-secondary hover:text-cyan-500 transition-colors">Technology</a>
                    <a href="#about" className="text-sm font-medium theme-text-secondary hover:text-cyan-500 transition-colors">About</a>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        className="p-2 rounded-xl theme-bg-tertiary theme-text-primary hover:opacity-80 transition-all"
                        onClick={toggleTheme}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                    {isAuthenticated ? (
                        <Link 
                            to="/dashboard" 
                            className="px-6 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform"
                        >
                            Open Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-bold theme-text-primary hover:text-cyan-500 transition-colors">Sign In</Link>
                            <Link 
                                to="/register" 
                                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
