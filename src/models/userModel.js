import { query } from '../db/index.js';

class User {
    static async create(nama, email, password, role = "user", isVerified = false) {
        const result = await query('INSERT INTO users (nama, email, password, role, isVerified) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, nama, email, role, isVerified, created_at', [nama, email, password, role, isVerified]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async updateProfile(userId, data) {
        const allowedFields = ['nama', 'tanggal_lahir', 'kelas'];
        const updates = Object.entries(data)
            .filter(([key]) => allowedFields.includes(key))
            .map(([key, value]) => `${key} = '${value}'`);
        
        if (updates.length === 0) return null;
        
        const sqlQuery = `
            UPDATE users 
            SET ${updates.join(', ')}, updated_at = NOW() 
            WHERE user_id = $1 
            RETURNING user_id, nama, email, tanggal_lahir, kelas, created_at, updated_at
        `;
        const result = await query(sqlQuery, [userId]);
        return result.rows[0];
    }

    static async findById(id) {
        const result = await query('SELECT * FROM users WHERE user_id = $1', [id]);
        return result.rows[0];
    }

    static async verifyEmail(userId) {
        const result = await query(
            'UPDATE users SET isVerified = true WHERE user_id = $1 RETURNING *',
            [userId]
        );
        return result.rows[0];
    }

    static async updateFirebaseUid(userId, firebaseUid) {
        const result = await query(
            'UPDATE users SET firebase_uid = $1, isverified = true WHERE user_id = $2 RETURNING *',
            [firebaseUid, userId]
        );
        return result.rows[0];
    }

    static async findByFirebaseUid(firebaseUid) {
        const result = await query('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUid]);
        return result.rows[0];
    }

    static async updatePassword(userId, newPassword) {
        const result = await query(
            'UPDATE users SET password = $1 WHERE user_id = $2 RETURNING user_id',
            [newPassword, userId]
        );
        return result.rows[0];
    }

    static async updateProfilePicture(userId, profilePicture) {
        const result = await query(
            'UPDATE users SET user_profile = $1 WHERE user_id = $2 RETURNING *',
            [profilePicture, userId]
        );
        return result.rows[0];
    }
}

export default User;