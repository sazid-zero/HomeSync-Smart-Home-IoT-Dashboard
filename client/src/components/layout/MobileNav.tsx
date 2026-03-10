import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { ConfirmationModal } from '../ui/ConfirmationModal.tsx';

export const MobileNav: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '/nav/window.png' },
        { path: '/rooms', label: 'Rooms', icon: '/nav/room.png' },
        { path: '/analytics', label: 'Analytics', icon: '/nav/history.png' },
        { path: '/notifications', label: 'Notification', icon: '/nav/notification.png' },
        { path: '/settings', label: 'Settings', icon: '/nav/settings.png' },
    ];

    return (
        <>
            <div className="lg:hidden fixed top-0 left-0 right-0 flex items-center justify-between p-4 theme-bg-secondary z-50 shadow-md">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <h1 className="text-lg font-bold theme-text-primary">HomeSync</h1>
                </Link>
                <button
                    className="text-xl theme-text-primary cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    ☰
                </button>
            </div>

            {isOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)}>
                    <div className="fixed right-0 top-0 h-full w-64 theme-bg-secondary shadow-lg z-50 p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center space-x-2">
                                <img src={user?.avatar_url || "/profile.jpg"} alt="User" className="rounded-full h-12 w-12 border-2 border-cyan-500/20" />
                            </div>
                            <button className="text-2xl theme-text-primary" onClick={() => setIsOpen(false)}>✕</button>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                            <span className="text-xs font-semibold theme-text-tertiary">Welcome back</span>
                            <span className="text-sm font-bold theme-text-primary mb-6">{user?.name || "User"}</span>
                        </div>

                        <div className="flex flex-col space-y-6 theme-text-primary flex-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) => 
                                        `flex items-center space-x-4 cursor-pointer py-1 ${
                                            isActive ? 'font-bold opacity-100' : 'opacity-70 hover:opacity-100'
                                        }`
                                    }
                                >
                                    <img src={item.icon} className="h-6 w-6 theme-icon-filter" alt="icon" />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}

                            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800">
                                <div
                                    className="flex items-center space-x-4 cursor-pointer hover:opacity-100 opacity-70 mb-6"
                                    onClick={toggleTheme}
                                >
                                    <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
                                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                                </div>
                                
                                <button 
                                    onClick={() => setIsLogoutModalOpen(true)}
                                    className="flex items-center space-x-4 cursor-pointer text-red-500 font-medium w-full text-left"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal 
                isOpen={isLogoutModalOpen}
                title="Sign Out"
                message="Are you sure you want to end your current session?"
                confirmText="Sign Out"
                variant="danger"
                onConfirm={() => {
                    logout();
                    setIsOpen(false);
                    setIsLogoutModalOpen(false);
                }}
                onCancel={() => setIsLogoutModalOpen(false)}
            />
        </>
    );
};
