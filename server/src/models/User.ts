import { query } from '../config/database.js';

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

export const UserModel = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  async findById(id: string): Promise<UserPublic | null> {
    const result = await query(
      'SELECT id, name, email, avatar_url, theme_preference, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async create(name: string, email: string, passwordHash: string): Promise<UserPublic> {
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, avatar_url, theme_preference, created_at',
      [name, email, passwordHash]
    );
    return result.rows[0];
  },

  async updateProfile(id: string, data: { name?: string; avatar_url?: string; theme_preference?: string }): Promise<UserPublic | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.name) { fields.push(`name = $${paramIndex++}`); values.push(data.name); }
    if (data.avatar_url !== undefined) { fields.push(`avatar_url = $${paramIndex++}`); values.push(data.avatar_url); }
    if (data.theme_preference) { fields.push(`theme_preference = $${paramIndex++}`); values.push(data.theme_preference); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, email, avatar_url, theme_preference, created_at`,
      values
    );
    return result.rows[0] || null;
  },

  async updatePassword(id: string, passwordHash: string): Promise<boolean> {
    const result = await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, id]);
    return (result.rowCount ?? 0) > 0;
  },

  async getPasswordHash(id: string): Promise<string | null> {
    const result = await query('SELECT password_hash FROM users WHERE id = $1', [id]);
    return result.rows[0]?.password_hash || null;
  },
};
