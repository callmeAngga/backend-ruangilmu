import { query } from '../db/index.js';

class Module {
    static async getModulesByCourseId(course_id) {
        const result = await query(
            'SELECT * FROM modules WHERE course_id = $1 ORDER BY module_order',
            [course_id]
        );
        return result.rows;
    }

    static async getModuleById(module_id) {
        const result = await query('SELECT * FROM modules WHERE module_id = $1', [module_id]);
        return result.rows[0];
    }

    static async checkModulePartOfCourse(module_id, course_id) {
        const result = await query(
            'SELECT * FROM modules WHERE module_id = $1 AND course_id = $2',
            [module_id, course_id]
        );
        return result.rows[0];
    }

    static async getModuleContent(module_id) {
        const result = await query(
            'SELECT * FROM module_contents WHERE module_id = $1 ORDER BY content_order',
            [module_id]
        );
        return result.rows;
    }

    static async getUserProgress(user_id, course_id) {
        const result = await query(
            `SELECT m.module_id, m.title, 
            CASE WHEN ump.completed_at IS NOT NULL THEN true ELSE false END as completed,
            ump.completed_at
            FROM modules m
            LEFT JOIN user_module_progress ump ON m.module_id = ump.module_id AND ump.user_id = $1
            WHERE m.course_id = $2
            ORDER BY m.module_order`,
            [user_id, course_id]
        );
        return result.rows;
    }

    static async markModuleAsCompleted(user_id, module_id) {
        const result = await query(
            `INSERT INTO user_module_progress (user_id, module_id, completed_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (user_id, module_id) 
            DO UPDATE SET completed_at = NOW()
            RETURNING *`,
            [user_id, module_id]
        );
        return result.rows[0];
    }

    static async checkModuleCompletion(user_id, module_id) {
        const result = await query(
            'SELECT * FROM user_module_progress WHERE user_id = $1 AND module_id = $2',
            [user_id, module_id]
        );
        return result.rows.length > 0;
    }

    static async checkPreviousModuleCompletion(user_id, course_id, module_order) {
        // Jika ini adalah modul pertama, tidak perlu cek sebelumnya
        if (module_order <= 1) {
            return true;
        }

        const result = await query(
            `SELECT COUNT(*) as completed_count
            FROM modules m
            JOIN user_module_progress ump ON m.module_id = ump.module_id
            WHERE m.course_id = $1 AND ump.user_id = $2 AND m.module_order = $3`,
            [course_id, user_id, module_order - 1]
        );
        
        return parseInt(result.rows[0].completed_count) > 0;
    }

    static async getNextModule(course_id, current_module_order) {
        const result = await query(
            `SELECT * FROM modules 
            WHERE course_id = $1 AND module_order > $2 
            ORDER BY module_order ASC LIMIT 1`,
            [course_id, current_module_order]
        );
        return result.rows[0];
    }

    static async getAllCompletedModules(user_id, course_id) {
        const result = await query(
            `SELECT COUNT(*) as completed_count
            FROM modules m
            JOIN user_module_progress ump ON m.module_id = ump.module_id
            WHERE m.course_id = $1 AND ump.user_id = $2`,
            [course_id, user_id]
        );
        
        const totalModulesResult = await query(
            'SELECT COUNT(*) as total_count FROM modules WHERE course_id = $1',
            [course_id]
        );
        
        return {
            completedCount: parseInt(result.rows[0].completed_count),
            totalCount: parseInt(totalModulesResult.rows[0].total_count)
        };
    }
}

export default Module;