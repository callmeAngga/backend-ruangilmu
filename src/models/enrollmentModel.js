import { query } from '../db/index.js';

class Enrollment {
    static async enrollCourse(user_id, course_id) {
        const result = await query('INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *', [user_id, course_id]);
        return result.rows[0];
    }

    static async unenrollCourse(user_id, course_id) {
        const result = await query('DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2 RETURNING *', [user_id, course_id]);
        return result.rows[0];
    }
}

export default Enrollment;