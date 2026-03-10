export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'warning' | 'info' | 'critical';
    is_read: boolean;
    created_at: Date;
}
export declare const NotificationModel: {
    findAllByUser(userId: string, limit?: number): Promise<Notification[]>;
    getUnreadCount(userId: string): Promise<number>;
    create(userId: string, title: string, message: string, type: "warning" | "info" | "critical"): Promise<Notification>;
    markAsRead(id: string, userId: string): Promise<boolean>;
    markAllAsRead(userId: string): Promise<void>;
    delete(id: string, userId: string): Promise<boolean>;
};
//# sourceMappingURL=Notification.d.ts.map