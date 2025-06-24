import { query } from '../db/index.js';

class Course {
    static async getCourseById(course_id) {
        const result = await query('SELECT * FROM courses WHERE course_id = $1', [course_id]);
        return result.rows[0];
    }

    static async getCourseBySlug(course_slug) {
        const result = await query('SELECT * FROM courses WHERE course_slug = $1', [course_slug]);
        return result.rows[0];
    }

    static async getAllCourses() {
        const result = await query("SELECT * FROM courses WHERE status = 'published'");
        return result.rows;
    }

    static async getEnrolledCoursesByUserId(user_id) {
        const result = await query('SELECT * FROM courses WHERE course_id IN (SELECT course_id FROM enrollments WHERE user_id = $1)', [user_id]);
        return result.rows;
    }

    static async checkUserEnrollment(user_id, course_id) {
        const result = await query('SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2', [user_id, course_id]);
        return result.rows.length > 0;
    }
}

export default Course;
