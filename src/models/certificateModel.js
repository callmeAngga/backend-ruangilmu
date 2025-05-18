const db = require('../db');

class Certificate {
    static async createCertificate(user_id, course_id, final_score) {
        const certificateNumber = this.generateCertificateNumber();
        
        const result = await db.query(
            `INSERT INTO certificates 
            (user_id, course_id, certificate_number, final_score, issue_date)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *`,
            [user_id, course_id, certificateNumber, final_score]
        );
        
        return result.rows[0];
    }

    static async getCertificate(user_id, course_id) {
        const result = await db.query(
            `SELECT c.*, u.nama as user_name, co.course_name
            FROM certificates c
            JOIN users u ON c.user_id = u.user_id
            JOIN courses co ON c.course_id = co.course_id
            WHERE c.user_id = $1 AND c.course_id = $2`,
            [user_id, course_id]
        );
        
        return result.rows[0];
    }

    static async getAllUserCertificates(user_id) {
        const result = await db.query(
            `SELECT c.*, co.course_name, c.issue_date
            FROM certificates c
            JOIN courses co ON c.course_id = co.course_id
            WHERE c.user_id = $1
            ORDER BY c.issue_date DESC`,
            [user_id]
        );
        
        return result.rows;
    }

    static async verifyCertificate(certificate_number) {
        const result = await db.query(
            `SELECT c.*, u.name as user_name, co.course_name
            FROM certificates c
            JOIN users u ON c.user_id = u.user_id
            JOIN courses co ON c.course_id = co.course_id
            WHERE c.certificate_number = $1`,
            [certificate_number]
        );
        
        return result.rows[0];
    }

    static generateCertificateNumber() {
        // Format: CERT-YYYYMMDD-XXXXXX (X = random alphanumeric)
        const date = new Date();
        const dateStr = date.getFullYear() +
            String(date.getMonth() + 1).padStart(2, '0') +
            String(date.getDate()).padStart(2, '0');
            
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let randomStr = '';
        
        for (let i = 0; i < 6; i++) {
            randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return `CERT-${dateStr}-${randomStr}`;
    }
}

module.exports = Certificate;