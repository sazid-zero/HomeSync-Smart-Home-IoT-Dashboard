import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useTheme } from '../contexts/ThemeContext.tsx';
import api from '../services/api.ts';
import { ConfirmationModal } from '../components/ui/ConfirmationModal.tsx';

const SettingsPage: React.FC = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // Auto-clear messages
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const [newName, setNewName] = useState(user?.name || '');
    const [newAvatar, setNewAvatar] = useState(user?.avatar_url || '');
    const [isProfileUpdating, setIsProfileUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setNewName(user.name);
            setNewAvatar(user.avatar_url || '');
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsProfileUpdating(true);
        try {
            await api.patch('/users/profile', { name: newName, avatar_url: newAvatar });
            setMessage({ text: "Profile updated successfully! Refresh to see changes globally.", type: 'success' });
            // Note: Ideally we would update the AuthContext user object here, 
            // but requiring a refresh is a simple fallback for now if the context doesn't expose a setUser method.
        } catch (err: any) {
            setMessage({ 
                text: err.response?.data?.error || "Failed to update profile", 
                type: 'error' 
            });
        } finally {
            setIsProfileUpdating(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ text: "New passwords don't match", type: 'error' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ text: "Password must be at least 6 characters", type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            await api.patch('/users/password', { currentPassword, newPassword });
            setMessage({ text: "Password updated successfully!", type: 'success' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setMessage({ 
                text: err.response?.data?.error || "Failed to update password", 
                type: 'error' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-6 lg:p-8 space-y-6">
            <div className="mb-2">
                 <h1 className="text-xl font-bold theme-text-primary">Settings</h1>
                 <p className="text-xs theme-text-secondary mt-1">Manage your account and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Profile Section */}
                <div className="space-y-6 lg:col-span-1">
                    <div className="theme-card-bg rounded-3xl theme-shadow-strong p-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center text-3xl font-bold mb-4 border border-cyan-500/20">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <h2 className="text-base font-bold theme-text-primary">{user?.name}</h2>
                        <p className="text-xs theme-text-tertiary mb-6">{user?.email}</p>
                        
                        <button 
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 font-semibold hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>

                    <div className="theme-card-bg rounded-3xl theme-shadow-strong p-6">
                        <h3 className="text-[11px] font-bold theme-text-primary mb-4 uppercase tracking-wider">Preferences</h3>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <h4 className="font-semibold theme-text-primary">Dark Mode</h4>
                                <p className="text-xs theme-text-tertiary">Toggle app appearance</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                                    isDarkMode ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                                        isDarkMode ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Settings Forms Section */}
                <div className="lg:col-span-2 space-y-6">
                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${
                            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Profile Update Section */}
                    <div className="theme-card-bg rounded-3xl theme-shadow-strong p-6">
                        <h3 className="text-base font-bold theme-text-primary mb-6">Profile Settings</h3>
                        
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold theme-text-secondary mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent theme-text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold theme-text-secondary mb-1">Profile Picture URL (Optional)</label>
                                <input
                                    type="url"
                                    value={newAvatar}
                                    onChange={e => setNewAvatar(e.target.value)}
                                    placeholder="https://example.com/my-pic.jpg"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent theme-text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isProfileUpdating || (!newName.trim() && !newAvatar.trim())}
                                className="w-full py-3 rounded-xl bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-transform active:scale-95 disabled:opacity-50"
                            >
                                {isProfileUpdating ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>

                    <div className="theme-card-bg rounded-3xl theme-shadow-strong p-6">
                        <h3 className="text-base font-bold theme-text-primary mb-6">Security</h3>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold theme-text-secondary mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent theme-text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold theme-text-secondary mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent theme-text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold theme-text-secondary mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent theme-text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-3 rounded-xl text-white font-bold transition-transform active:scale-95 disabled:opacity-50"
                                    style={{ background: 'var(--gradient-bg)' }}
                                >
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

            <ConfirmationModal 
                isOpen={isLogoutModalOpen}
                title="Sign Out"
                message="Are you sure you want to end your session? You will be redirected to the landing page."
                confirmText="Sign Out"
                variant="danger"
                onConfirm={logout}
                onCancel={() => setIsLogoutModalOpen(false)}
            />
        </div>
    );
};

export default SettingsPage;
