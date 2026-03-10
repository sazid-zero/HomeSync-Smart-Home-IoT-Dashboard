import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { ConfirmationModal } from '../ui/ConfirmationModal.tsx';
import { useState } from 'react';

export const Sidebar: React.FC = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { logout, user } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: '/nav/window.png' },
        { path: '/rooms', label: 'Rooms', icon: '/nav/room.png' },
        { path: '/analytics', label: 'Energy', icon: '/nav/history.png' },
        { path: '/notifications', label: 'Alerts', icon: '/nav/notification.png' },
        { path: '/settings', label: 'Settings', icon: '/nav/settings.png' },
    ];

    return (
        <div className="hidden lg:flex w-52 theme-bg-secondary min-h-screen py-8 px-4 flex-col flex-shrink-0 z-10 sticky top-0 border-r theme-border">
            {/* Logo / Brand */}
            <Link to="/" className="flex items-center px-2 mb-10 space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-bold text-lg">H</div>
                <span className="text-lg font-bold tracking-tight theme-text-primary">HomeSync</span>
            </Link>

            {/* Profile Section */}
            <div className="flex items-center px-2 mb-10 space-x-3 bg-cyan-500/5 dark:bg-cyan-400/10 p-3 rounded-2xl border border-cyan-500/10">
                <img src={user?.avatar_url || "/profile.jpg"} alt="User" className="rounded-xl h-9 w-9 object-cover border border-cyan-500/20" />
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] uppercase font-bold text-cyan-500 tracking-wider">Resident</span>
                    <span className="text-xs font-bold theme-text-primary truncate">{user?.name || "User"}</span>
                </div>
            </div>
            
            <nav className="flex flex-col space-y-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase px-3 py-2 tracking-widest">Menu</span>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                                isActive 
                                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                                : 'theme-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <img 
                                    src={item.icon} 
                                    className={`h-4 w-4 transition-all ${
                                        isActive ? 'brightness-0 invert' : 'theme-icon-filter opacity-70 group-hover:opacity-100'
                                    }`} 
                                    alt={item.label} 
                                    style={isActive ? { filter: 'brightness(0) invert(1)' } : {}}
                                />
                                <span className="text-[13px] font-medium tracking-tight">
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase px-3 py-2 tracking-widest">Preferences</span>
                
                <button
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full theme-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={toggleTheme}
                >
                    <span className="text-sm">{isDarkMode ? '☀️' : '🌙'}</span>
                    <span className="text-[13px] font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                
                <button 
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-red-500/70 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 mt-2"
                >
                    <img src="/nav/faq.png" className="h-4 w-4" alt="Logout" style={{ filter: 'invert(42%) sepia(85%) saturate(3048%) hue-rotate(338deg) brightness(101%) contrast(92%)' }} />
                    <span className="text-[13px] font-medium">Logout</span>
                </button>
            </div>

            <ConfirmationModal 
                isOpen={isLogoutModalOpen}
                title="Sign Out"
                message="Are you sure you want to end your current session?"
                confirmText="Sign Out"
                variant="danger"
                onConfirm={logout}
                onCancel={() => setIsLogoutModalOpen(false)}
            />
        </div>
    );
};
