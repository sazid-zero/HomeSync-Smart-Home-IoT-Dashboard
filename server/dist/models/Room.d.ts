export interface Room {
    id: string;
    user_id: string;
    name: string;
    icon: string | null;
    created_at: Date;
}
export interface RoomWithStats extends Room {
    device_count: number;
    active_devices: number;
}
export declare const RoomModel: {
    findAllByUser(userId: string): Promise<RoomWithStats[]>;
    findById(id: string, userId: string): Promise<Room | null>;
    create(userId: string, name: string, icon?: string): Promise<Room>;
    update(id: string, userId: string, data: {
        name?: string;
        icon?: string;
    }): Promise<Room | null>;
    delete(id: string, userId: string): Promise<boolean>;
};
//# sourceMappingURL=Room.d.ts.map