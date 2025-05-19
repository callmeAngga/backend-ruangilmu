const db = require('../db');

class Enrollment {
    static async enrollCourse(user_id, course_id) {
        const result = await db.query('INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *', [user_id, course_id]);
        return result.rows[0];
    }

    static async unenrollCourse(user_id, course_id) {
        const result = await db.query('DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2 RETURNING *', [user_id, course_id]);
        return result.rows[0];
    }
}

module.exports = Enrollment;