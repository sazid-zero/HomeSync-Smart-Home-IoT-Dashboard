import React, { useState, useEffect } from 'react';
import api from '../services/api.ts';
import { useSocket } from '../hooks/useSocket.ts';
import type { Notification } from '../types/index.ts';

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.notifications || []);
            setError(null);
        } catch (err: any) {
             if (err.message !== 'Network Error' || !document.location.href.includes('localhost')) {
                setError(err.response?.data?.error || 'Failed to fetch notifications');
             }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useSocket({
        onNewNotification: (notif) => {
            setNotifications(prev => [notif, ...prev]);
        }
    });

    const markAsRead = async (id: string) => {
         setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
         try {
             await api.patch(`/notifications/${id}/read`);
         } catch(err) {
             console.error('Failed to mark as read', err);
         }
    };
    
    const markAllAsRead = async () => {
         setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
         try {
             await api.patch(`/notifications/read-all`);
         } catch(err) {
             console.error('Failed to mark all as read', err);
         }
    };

    const clearAll = async () => {
        const confirm = window.confirm("Are you sure you want to delete all notifications?");
        if (!confirm) return;
        
        setNotifications([]);
        try {
             await api.delete(`/notifications`);
        } catch(err) {
             console.error('Failed to clear notifications', err);
             fetchNotifications(); // revert on fail
        }
    };

    const getIcon = (type: string) => {
        switch(type) {
            case 'warning': return '⚠️';
            case 'critical': return '🚨';
            default: return 'ℹ️';
        }
    };

    if (isLoading) return <div className="flex-1 flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex justify-between items-end mb-4 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div>
                     <h1 className="text-xl font-bold theme-text-primary">Notifications</h1>
                     <p className="text-xs theme-text-secondary mt-1">System alerts and device activities</p>
                </div>
                <div className="flex space-x-3">
                    <button 
                        onClick={markAllAsRead}
                        className="text-xs font-semibold theme-text-primary px-3 py-1.5 rounded-lg theme-bg-tertiary hover:opacity-80 transition-opacity"
                    >
                        Mark all read
                    </button>
                    <button 
                        onClick={clearAll}
                        className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-100 text-red-600 rounded-lg">{error}</div>}

            <div className="flex-1 space-y-3">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">📭</span>
                        </div>
                        <p className="theme-text-secondary">You're all caught up!</p>
                        <p className="text-xs theme-text-tertiary mt-1">No new notifications.</p>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <div 
                            key={notif.id}
                            className={`flex items-start p-4 rounded-2xl border transition-colors ${
                                notif.is_read 
                                    ? 'bg-transparent border-gray-100 dark:border-gray-800' 
                                    : 'theme-card-bg border-transparent shadow-sm'
                            }`}
                            onClick={() => !notif.is_read && markAsRead(notif.id)}
                        >
                            <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center mr-4 ${
                                notif.type === 'critical' ? 'bg-red-100 text-red-600' : 
                                notif.type === 'warning' ? 'bg-orange-100 text-orange-600' : 
                                'bg-cyan-100 text-cyan-600'
                            }`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0 pr-4 mt-0.5 cursor-pointer">
                                <h4 className={`text-[13px] truncate ${notif.is_read ? 'theme-text-secondary font-medium' : 'theme-text-primary font-bold'}`}>
                                    {notif.title}
                                </h4>
                                <p className={`text-[11px] mt-1 ${notif.is_read ? 'theme-text-tertiary' : 'theme-text-secondary'}`}>
                                    {notif.message}
                                </p>
                                <p className="text-[10px] theme-text-tertiary mt-2 uppercase tracking-wide">
                                    {new Date(notif.created_at).toLocaleString()}
                                </p>
                            </div>
                            {!notif.is_read && (
                                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
