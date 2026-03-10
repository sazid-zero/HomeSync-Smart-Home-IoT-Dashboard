export interface SensorReading {
    id: string;
    device_id: string;
    reading_type: string;
    value: number;
    unit: string;
    recorded_at: Date;
}
export declare const SensorModel: {
    create(deviceId: string, readingType: string, value: number, unit: string): Promise<SensorReading>;
    createBatch(readings: {
        device_id: string;
        reading_type: string;
        value: number;
        unit: string;
    }[]): Promise<void>;
    getReadings(params: {
        deviceId?: string;
        readingType?: string;
        range?: string;
        userId: string;
    }): Promise<SensorReading[]>;
    getAnalytics(userId: string, period?: string): Promise<{
        date: string;
        total_consumption: number;
        reading_count: number;
    }[]>;
    getAirQuality(userId: string): Promise<{
        co2: number;
        pollutant: number;
    } | null>;
};
//# sourceMappingURL=SensorReading.d.ts.map