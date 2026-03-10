export interface Device {
    id: string;
    room_id: string;
    user_id: string;
    name: string;
    type: string;
    control_type: 'toggle' | 'slider';
    is_on: boolean;
    value: number;
    power_consumption: number;
    icon_name: string | null;
    created_at: Date;
}
export interface DeviceWithRoom extends Device {
    room_name: string;
}
export declare const DeviceModel: {
    findAllByUser(userId: string): Promise<DeviceWithRoom[]>;
    findByRoom(roomId: string, userId: string): Promise<Device[]>;
    findById(id: string, userId: string): Promise<DeviceWithRoom | null>;
    create(data: {
        room_id: string;
        user_id: string;
        name: string;
        type: string;
        control_type: "toggle" | "slider";
        power_consumption?: number;
        icon_name?: string;
    }): Promise<Device>;
    update(id: string, userId: string, data: Partial<Pick<Device, "name" | "type" | "control_type" | "room_id" | "power_consumption" | "icon_name">>): Promise<Device | null>;
    toggle(id: string, userId: string): Promise<Device | null>;
    updateValue(id: string, userId: string, value: number): Promise<Device | null>;
    delete(id: string, userId: string): Promise<boolean>;
    getPowerConsumption(userId: string): Promise<{
        name: string;
        power_consumption: number;
        is_on: boolean;
        icon_name: string | null;
    }[]>;
};
//# sourceMappingURL=Device.d.ts.map