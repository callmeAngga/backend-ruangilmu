import { query } from '../db/index.js';
class Admin {
    static async getTotalUsers() {
        const result = await query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['user']);
        return parseInt(result.rows[0].total);
    }

    static async getTotalCourses() {
        const result = await query('SELECT COUNT(*) as total FROM courses');
        return parseInt(result.rows[0].total);
    }

    static async getCourseCompletionRatio() {

        const result = await query(`
            SELECT COUNT(*) as total
            FROM certificates
        `);
        const totalFinish = parseInt(result.rows[0].total);

        if (totalFinish === 0) return 0;
        return (totalFinish / await this.getTotalUsers()) * 100;
    }

    static async getReviewStats() {
        const result = await query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN sentiment = 'positif' THEN 1 END) as positive,
                COUNT(CASE WHEN sentiment = 'negatif' THEN 1 END) as negative
            FROM reviews
        `);
        const stats = result.rows[0];

        return {
            total: parseInt(stats.total),
            positive: parseInt(stats.positive),
            negative: parseInt(stats.negative),
            neutral: parseInt(stats.neutral)
        };
    }

    static async getUserGrowthByMonth(months = 12) {
        const result = await query(`
            SELECT 
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as user_count
            FROM users 
            WHERE role = 'user' 
                AND created_at >= NOW() - INTERVAL '${months} months'
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY month ASC
        `);

        return result.rows.map(row => ({
            month: row.month.toISOString().substring(0, 7),
            count: parseInt(row.user_count),
            label: new Date(row.month).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long'
            })
        }));
    }

    static async getCertificatesPerCourse() {
        const result = await query(`
            SELECT 
                c.course_name,
                COUNT(cert.certificate_id) as certificate_count
            FROM courses c
            LEFT JOIN certificates cert ON c.course_id = cert.course_id
            GROUP BY c.course_id, c.course_name
            ORDER BY certificate_count DESC
        `);

        return result.rows.map(row => ({
            course_name: row.course_name,
            count: parseInt(row.certificate_count),
            label: row.course_name
        }));
    }

    static async getReviewsSentimentByCourse() {
        const result = await query(`
            SELECT 
                c.course_name,
                r.sentiment,
                COUNT(*) as count
            FROM courses c
            LEFT JOIN reviews r ON c.course_id = r.course_id
            WHERE r.sentiment IS NOT NULL
            GROUP BY c.course_name, r.sentiment
            ORDER BY c.course_name, r.sentiment
        `);

        const groupedData = {};
        result.rows.forEach(row => {
            const key = row.course_name;
            if (!groupedData[key]) {
                groupedData[key] = {
                    course_name: row.course_name,
                    positif: 0,
                    negatif: 0
                };
            }
            groupedData[key][row.sentiment] = parseInt(row.count);
        });

        return Object.values(groupedData);
    }

    static async getUsersPerClass() {
        const result = await query(`
            SELECT 
                kelas,
                COUNT(*) as user_count
            FROM users 
            WHERE role = 'user' AND kelas IS NOT NULL
            GROUP BY kelas
            ORDER BY kelas ASC
        `);

        return result.rows.map(row => ({
            class: `Kelas ${row.kelas}`,
            count: parseInt(row.user_count),
            label: `Kelas ${row.kelas}`
        }));
    }

    static async getCoursesTableData(limit, offset, sortBy = 'enrolled_users', sortOrder = 'asc') {
        const validSortColumns = {
            'course_name': 'c.course_name',
            'enrolled_users': 'enrolled_users',
            'positive_reviews': 'positive_reviews',
            'negative_reviews': 'negative_reviews',
            'total_reviews': 'total_reviews'
        };

        const sortColumn = validSortColumns[sortBy] || 'enrolled_users';
        const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        const result = await query(`
            SELECT 
                ROW_NUMBER() OVER (ORDER BY ${sortColumn} ${order}) as no,
                course_name,
                enrolled_users,
                positive_reviews,
                negative_reviews,
                total_reviews
            FROM (
                SELECT 
                    c.course_name,
                    COUNT(DISTINCT e.user_id) as enrolled_users,
                    COUNT(CASE WHEN r.sentiment = 'positif' THEN 1 END) as positive_reviews,
                    COUNT(CASE WHEN r.sentiment = 'negatif' THEN 1 END) as negative_reviews,
                    COUNT(r.review_id) as total_reviews
                FROM courses c
                LEFT JOIN enrollments e ON c.course_id = e.course_id
                LEFT JOIN reviews r ON c.course_id = r.course_id
                GROUP BY c.course_id, c.course_name
            ) AS course_stats
            ORDER BY ${sortColumn} ${order}
            LIMIT $1 OFFSET $2
        `, [limit, offset]);
        return result.rows.map(row => ({
            no: parseInt(row.no),
            course_name: row.course_name,
            enrolled_users: parseInt(row.enrolled_users),
            positive_reviews: parseInt(row.positive_reviews),
            negative_reviews: parseInt(row.negative_reviews),
            total_reviews: parseInt(row.total_reviews)
        }));
    }

    static async getTotalCoursesCount() {
        const result = await query('SELECT COUNT(*) as total FROM courses');
        return parseInt(result.rows[0].total);
    }

    static async getTopPerformUsersData(limit, offset) {
        const result = await query(`
            SELECT 
                ROW_NUMBER() OVER (ORDER BY completed_courses DESC, total_enrollments DESC) as no,
                nama,
                total_enrollments,
                completed_courses
            FROM (
                SELECT 
                    u.nama,
                    COUNT(DISTINCT e.course_id) as total_enrollments,
                    COUNT(DISTINCT CASE WHEN e.is_completed = true THEN e.course_id END) as completed_courses
                FROM users u
                LEFT JOIN enrollments e ON u.user_id = e.user_id
                WHERE u.role = 'user'
                GROUP BY u.user_id, u.nama
                HAVING COUNT(DISTINCT e.course_id) > 0
            ) AS user_stats
            ORDER BY completed_courses DESC, total_enrollments DESC
            LIMIT $1 OFFSET $2
        `, [limit, offset]);
        return result.rows.map(row => ({
            no: parseInt(row.no),
            nama: row.nama,
            total_enrollments: parseInt(row.total_enrollments),
            completed_courses: parseInt(row.completed_courses)
        }));
    }

    static async getTotalUsersCount() {
        const result = await query(`
            SELECT COUNT(DISTINCT u.user_id) as total 
            FROM users u
            LEFT JOIN enrollments e ON u.user_id = e.user_id
            WHERE u.role = 'user' AND e.course_id IS NOT NULL
        `);
        return parseInt(result.rows[0].total);
    }

    static async getAllCourses(limit, offset, search = '', status = '') {
        let sqlQuery = `
            SELECT 
                c.*,
                COUNT(DISTINCT e.enrolment_id) as enrollment_count,
                COUNT(DISTINCT m.module_id) as module_count
            FROM courses c
            LEFT JOIN enrollments e ON c.course_id = e.course_id
            LEFT JOIN modules m ON c.course_id = m.course_id
        `;

        const conditions = [];
        const params = [];
        let paramIndex = 1;

        if (search) {
            conditions.push(`(LOWER(c.course_name) LIKE LOWER($${paramIndex}) OR LOWER(c.course_description) LIKE LOWER($${paramIndex}))`);
            params.push(`%${search}%`);
            paramIndex++;
        }

        if (status) { 
            conditions.push(`c.status = $${paramIndex}`);
            params.push(status);
            paramIndex++;
        }

        if (conditions.length > 0) {
            sqlQuery += ' WHERE ' + conditions.join(' AND ');
        }

        sqlQuery += `
            GROUP BY c.course_id
            ORDER BY c.created_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        params.push(limit, offset);

        const result = await query(sqlQuery, params);
        return result.rows;
    }

    static async getCoursesCount(search = '', status = '') { 
        let sqlQuery = 'SELECT COUNT(*) FROM courses c'; 
        const conditions = [];
        const params = [];
        let paramIndex = 1;

        if (search) {
            conditions.push(`(LOWER(c.course_name) LIKE LOWER($${paramIndex}) OR LOWER(c.course_description) LIKE LOWER($${paramIndex}))`);
            params.push(`%${search}%`);
            paramIndex++;
        }

        if (status) {
            conditions.push(`c.status = $${paramIndex}`);
            params.push(status);
            paramIndex++;
        }

        if (conditions.length > 0) {
            sqlQuery += ' WHERE ' + conditions.join(' AND ');
        }

        const result = await query(sqlQuery, params);
        return parseInt(result.rows[0].count);
    }

    static async getCourseById(courseId) {
        const sqlQuery = `
            SELECT * FROM courses WHERE course_id = $1
        `;

        const result = await query(sqlQuery, [courseId]);
        return result.rows[0] || null;
    }

    static async createCourse(courseData) {
        const {
            course_name,
            course_description,
            course_image_profile = 'default-profile.png',
            course_image_cover = 'default-cover.png',
            course_price,
            course_slug,
            status
        } = courseData;

        const sqlQuery = `
        INSERT INTO courses (
            course_name,
            course_description,
            course_image_profile,
            course_image_cover,
            course_price,
            course_slug,
            status,
            created_at,
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *
    `;

        const result = await query(sqlQuery, [
            course_name,
            course_description,
            course_image_profile,
            course_image_cover,
            course_price,
            course_slug,
            status
        ]);

        return result.rows[0];
    }

    static async updateCourse(courseId, courseData) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.entries(courseData).forEach(([key, value]) => {
            if (value !== undefined && key !== 'course_id') {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            return await this.getCourseById(courseId);
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(courseId);

        const sqlQuery = `
        UPDATE courses
        SET ${fields.join(', ')}
        WHERE course_id = $${paramCount}
        RETURNING *
    `;

        const result = await query(sqlQuery, values);
        return result.rows[0] || null;
    }

    static async deleteCourse(courseId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await client.query('DELETE FROM certificates WHERE course_id = $1', [courseId]);
            await client.query('DELETE FROM user_quiz_results WHERE quiz_id IN (SELECT quiz_id FROM quizzes WHERE course_id = $1)', [courseId]);
            await client.query('DELETE FROM quiz_options WHERE question_id IN (SELECT question_id FROM quiz_questions WHERE quiz_id IN (SELECT quiz_id FROM quizzes WHERE course_id = $1))', [courseId]);
            await client.query('DELETE FROM quiz_questions WHERE quiz_id IN (SELECT quiz_id FROM quizzes WHERE course_id = $1)', [courseId]);
            await client.query('DELETE FROM quizzes WHERE course_id = $1', [courseId]);
            await client.query('DELETE FROM user_module_progress WHERE module_id IN (SELECT module_id FROM modules WHERE course_id = $1)', [courseId]);
            await client.query('DELETE FROM module_contents WHERE module_id IN (SELECT module_id FROM modules WHERE course_id = $1)', [courseId]);
            await client.query('DELETE FROM modules WHERE course_id = $1', [courseId]);
            await client.query('DELETE FROM reviews WHERE course_id = $1', [courseId]);
            await client.query('DELETE FROM enrollments WHERE course_id = $1', [courseId]);

            const result = await client.query('DELETE FROM courses WHERE course_id = $1 RETURNING *', [courseId]);

            await client.query('COMMIT');
            return result.rows[0] || null;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async getModulesByCourse(courseId) {
        const sqlQuery = `
            SELECT
                module_id,
                course_id,
                title,
                description,
                module_order,
                created_at,
                updated_at
            FROM modules
            WHERE course_id = $1
            ORDER BY module_order ASC
        `;

        const result = await query(sqlQuery, [courseId]);
        return result.rows;
    }

    static async getModuleById(moduleId) {
        const sqlQuery = `
            SELECT
                module_id,
                course_id,
                title,
                description,
                module_order,
                created_at,
                updated_at
            FROM modules
            WHERE module_id = $1
        `;

        const result = await query(sqlQuery, [moduleId]);
        return result.rows[0] || null;
    }

    static async createModule(moduleData) {
        const {
            course_id,
            title,
            description,
            module_order
        } = moduleData;

        const sqlQuery = `
            INSERT INTO modules (
                course_id,
                title,
                description,
                module_order
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const result = await query(sqlQuery, [
            course_id,
            title,
            description,
            module_order
        ]);

        return result.rows[0];
    }

    static async updateModule(moduleId, moduleData) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.entries(moduleData).forEach(([key, value]) => {
            if (value !== undefined && key !== 'module_id') {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            return await this.getModuleById(moduleId);
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(moduleId);

        const sqlQuery = `
            UPDATE modules
            SET ${fields.join(', ')}
            WHERE module_id = $${paramCount}
            RETURNING *
        `;

        const result = await query(sqlQuery, values);
        return result.rows[0] || null;
    }

    static async deleteModule(moduleId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await client.query('DELETE FROM user_quiz_results WHERE quiz_id IN (SELECT quiz_id FROM quizzes WHERE module_id = $1)', [moduleId]);
            await client.query('DELETE FROM quiz_options WHERE question_id IN (SELECT question_id FROM quiz_questions WHERE quiz_id IN (SELECT quiz_id FROM quizzes WHERE module_id = $1))', [moduleId]);
            await client.query('DELETE FROM quiz_questions WHERE quiz_id IN (SELECT quiz_id FROM quizzes WHERE module_id = $1)', [moduleId]);
            await client.query('DELETE FROM quizzes WHERE module_id = $1', [moduleId]);
            await client.query('DELETE FROM user_module_progress WHERE module_id = $1', [moduleId]);
            await client.query('DELETE FROM module_contents WHERE module_id = $1', [moduleId]);

            const result = await client.query('DELETE FROM modules WHERE module_id = $1 RETURNING *', [moduleId]);

            await client.query('COMMIT');
            return result.rows[0] || null;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async getContentsByModule(moduleId) {
        const sqlQuery = `
            SELECT
                content_id,
                module_id,
                content_type,
                content,
                content_order,
                created_at,
                updated_at
            FROM module_contents
            WHERE module_id = $1
            ORDER BY content_order ASC
        `;

        const result = await query(sqlQuery, [moduleId]);
        return result.rows;
    }

    static async getContentById(contentId) {
        const sqlQuery = `
            SELECT
                content_id,
                module_id,
                content_type,
                content,
                content_order,
                created_at,
                updated_at
            FROM module_contents
            WHERE content_id = $1
        `;

        const result = await query(sqlQuery, [contentId]);
        return result.rows[0] || null;
    }

    static async createContent(contentData) {
        const {
            module_id,
            content_type,
            content,
            content_order
        } = contentData;

        const sqlQuery = `
            INSERT INTO module_contents (
                module_id,
                content_type,
                content,
                content_order
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const result = await query(sqlQuery, [
            module_id,
            content_type,
            content,
            content_order
        ]);

        return result.rows[0];
    }

    static async updateContent(contentId, contentData) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.entries(contentData).forEach(([key, value]) => {
            if (value !== undefined && key !== 'content_id') {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            return await this.getContentById(contentId);
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(contentId);

        const sqlQuery = `
            UPDATE module_contents
            SET ${fields.join(', ')}
            WHERE content_id = $${paramCount}
            RETURNING *
        `;

        const result = await query(sqlQuery, values);
        return result.rows[0] || null;
    }

    static async deleteContent(contentId) {
        const sqlQuery = 'DELETE FROM module_contents WHERE content_id = $1 RETURNING *';
        const result = await query(sqlQuery, [contentId]);
        return result.rows[0] || null;
    }
}

export default Admin;