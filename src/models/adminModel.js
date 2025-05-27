const db = require('../db');

class Admin {
    static async getTotalUsers() {
        const query = 'SELECT COUNT(*) as total FROM users WHERE role = $1';
        const result = await db.query(query, ['user']);
        return parseInt(result.rows[0].total);
    }

    static async getTotalCourses() {
        const query = 'SELECT COUNT(*) as total FROM courses';
        const result = await db.query(query);
        return parseInt(result.rows[0].total);
    }

    static async getCourseCompletionRatio() {
        const query = `
            SELECT 
                COUNT(*) as total
            FROM certificates
        `;

        const result = await db.query(query);
        const totalFinish = parseInt(result.rows[0].total);

        if (totalFinish === 0) return 0;
        return (totalFinish / await this.getTotalUsers()) * 100;
    }

    static async getReviewStats() {
        const query = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN sentiment = 'positif' THEN 1 END) as positive,
                COUNT(CASE WHEN sentiment = 'negatif' THEN 1 END) as negative
            FROM reviews
        `;

        const result = await db.query(query);
        const stats = result.rows[0];

        return {
            total: parseInt(stats.total),
            positive: parseInt(stats.positive),
            negative: parseInt(stats.negative),
            neutral: parseInt(stats.neutral)
        };
    }

    static async getUserGrowthByMonth(months = 12) {
        const query = `
            SELECT 
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as user_count
            FROM users 
            WHERE role = 'user' 
                AND created_at >= NOW() - INTERVAL '${months} months'
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY month ASC
        `;
        const result = await db.query(query);

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
        const query = `
            SELECT 
                c.course_name,
                COUNT(cert.certificate_id) as certificate_count
            FROM courses c
            LEFT JOIN certificates cert ON c.course_id = cert.course_id
            GROUP BY c.course_id, c.course_name
            ORDER BY certificate_count DESC
        `;
        const result = await db.query(query);

        return result.rows.map(row => ({
            course_name: row.course_name,
            count: parseInt(row.certificate_count),
            label: row.course_name
        }));
    }

    static async getReviewsSentimentByCourse() {
        const query = `
            SELECT 
                c.course_name,
                r.sentiment,
                COUNT(*) as count
            FROM courses c
            LEFT JOIN reviews r ON c.course_id = r.course_id
            WHERE r.sentiment IS NOT NULL
            GROUP BY c.course_name, r.sentiment
            ORDER BY c.course_name, r.sentiment
        `;
        const result = await db.query(query);

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
        const query = `
            SELECT 
                kelas,
                COUNT(*) as user_count
            FROM users 
            WHERE role = 'user' AND kelas IS NOT NULL
            GROUP BY kelas
            ORDER BY kelas ASC
        `;
        const result = await db.query(query);

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
        const query = `
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
        `;

        const result = await db.query(query, [limit, offset]);
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
        const query = 'SELECT COUNT(*) as total FROM courses';
        const result = await db.query(query);
        return parseInt(result.rows[0].total);
    }

    static async getTopPerformUsersData(limit, offset) {
        const query = `
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
        `;

        const result = await db.query(query, [limit, offset]);
        return result.rows.map(row => ({
            no: parseInt(row.no),
            nama: row.nama,
            total_enrollments: parseInt(row.total_enrollments),
            completed_courses: parseInt(row.completed_courses)
        }));
    }

    static async getTotalUsersCount() {
        const query = `
            SELECT COUNT(DISTINCT u.user_id) as total 
            FROM users u
            LEFT JOIN enrollments e ON u.user_id = e.user_id
            WHERE u.role = 'user' AND e.course_id IS NOT NULL
        `;
        const result = await db.query(query);
        return parseInt(result.rows[0].total);
    }
}

module.exports = Admin;