const db = require('../db');

class Review {
    static async createReview(user_id, course_id, content) {
        const result = await db.query(
            'INSERT INTO reviews (user_id, course_id, content, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
            [user_id, course_id, content]
        );
        return result.rows[0];
    }

    static async getReviewById(review_id) {
        const result = await db.query('SELECT * FROM reviews WHERE review_id = $1', [review_id]);
        return result.rows[0];
    }

    static async getReviewsByUserId(user_id) {
        const result = await db.query('SELECT * FROM reviews WHERE user_id = $1', [user_id]);
        return result.rows;
    }

    static async getReviewsByCourseId(course_id, user_id) {
        const result = await db.query(`
            SELECT r.*, u.nama,
               CASE WHEN r.user_id = $2 THEN 0 ELSE 1 END AS priority
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.course_id = $1
            ORDER BY priority, r.created_at DESC
        `, [course_id, user_id]);
        return result.rows;
    }

    static async updateReview(review_id, content) {
        const result = await db.query(
            'UPDATE reviews SET content = $1, updated_at = NOW(), sentiment = NULL WHERE review_id = $2 RETURNING *',
            [content, review_id]
        );
        return result.rows[0];
    }

    static async deleteReview(review_id) {
        await db.query('DELETE FROM reviews WHERE review_id = $1', [review_id]);
        return true;
    }

    static async checkUserReviewExists(user_id, course_id) {
        const result = await db.query('SELECT * FROM reviews WHERE user_id = $1 AND course_id = $2', [user_id, course_id]);
        return result.rows.length > 0;
    }

    static async getUserReviewForCourse(user_id, course_id) {
        const result = await db.query('SELECT * FROM reviews WHERE user_id = $1 AND course_id = $2', [user_id, course_id]);
        return result.rows[0];
    }

    static async updateSentiment(review_id, sentiment) {
        const result = await db.query(
            'UPDATE reviews SET sentiment = $1 WHERE review_id = $2 RETURNING *',
            [sentiment, review_id]
        );
        return result.rows[0];
    }
}

module.exports = Review;