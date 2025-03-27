const db = require('../db');
const bcrypt = require('bcrypt');

class User {
    static async create(nama, email, password, role = "user"){
        const result = await db.query('INSERT INTO users (nama, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, nama, email, role, created_at', [nama, email, password, role]); 
        return result.rows[0];  
    }

    static async findByEmail(email){
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async findById(id){
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
    
}

module.exports = User;