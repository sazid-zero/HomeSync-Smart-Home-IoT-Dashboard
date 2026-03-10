export interface User {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    avatar_url: string | null;
    theme_preference: string;
    created_at: Date;
}
export type UserPublic = Omit<User, 'password_hash'>;
export declare const UserModel: {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<UserPublic | null>;
    create(name: string, email: string, passwordHash: string): Promise<UserPublic>;
    updateProfile(id: string, data: {
        name?: string;
        avatar_url?: string;
        theme_preference?: string;
    }): Promise<UserPublic | null>;
    updatePassword(id: string, passwordHash: string): Promise<boolean>;
    getPasswordHash(id: string): Promise<string | null>;
};
//# sourceMappingURL=User.d.ts.map