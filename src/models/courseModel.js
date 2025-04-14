const db = require('../db');

class Course {
    static async getCourseById(course_id) {
        const result = await db.query('SELECT * FROM courses WHERE course_id = $1', [course_id]);
        console.log('Query Result:', result.rows);
        return result.rows[0];
    }

    static async getAllCourses() {
        const result = await db.query('SELECT * FROM courses');
        return result.rows;
    }

    static async getEnrolledCoursesByUserId(user_id) {
        const result = await db.query('SELECT * FROM courses WHERE course_id IN (SELECT course_id FROM enrollments WHERE user_id = $1)', [user_id]);
        return result.rows;
    }

    static async checkUserEnrollment(user_id, course_id) {
        const result = await db.query('SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2', [user_id, course_id]);
        return result.rows.length > 0;
    }
}

module.exports = Course;
