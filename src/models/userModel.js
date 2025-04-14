const db = require('../db');

class User {
    static async create(nama, email, password, role = "user", isVerified = false) {
        const result = await db.query('INSERT INTO users (nama, email, password, role, isVerified) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, nama, email, role, isVerified, created_at', [nama, email, password, role, isVerified]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM users WHERE user_id = $1', [id]);
        return result.rows[0];
    }

    static async verifyEmail(userId) {
        const result = await db.query(
            'UPDATE users SET isVerified = true WHERE user_id = $1 RETURNING *',
            [userId]
        );
        return result.rows[0];
    }

    static async updateFirebaseUid(userId, firebaseUid) {
        const result = await db.query(
            'UPDATE users SET firebase_uid = $1 WHERE user_id = $2 RETURNING *',
            [firebaseUid, userId]
        );
        return result.rows[0];
    }

    static async findByFirebaseUid(firebaseUid) {
        const result = await db.query('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUid]);
        return result.rows[0];
    }
}

module.exports = User;