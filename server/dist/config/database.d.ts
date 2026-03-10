export declare const pool: import("pg").Pool;
export declare function query(text: string, params?: unknown[]): Promise<import("pg").QueryResult<any>>;
export declare function testConnection(): Promise<boolean>;
//# sourceMappingURL=database.d.ts.map