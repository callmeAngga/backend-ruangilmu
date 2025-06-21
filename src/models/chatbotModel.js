import { query } from '../db/index.js';

class ChatbotModel {
    static async getCourseContext(courseId) {
        const result = await query('SELECT course_id, course_name, course_description FROM courses WHERE course_id = $1', [courseId]);
        return result.rows[0] || null;
    }

    static async getModuleWithContent(courseId, moduleId) {
        const moduleResult = await query('SELECT module_id, title, description, module_order FROM modules WHERE course_id = $1 AND module_id = $2', [courseId, moduleId]);
        
        if (moduleResult.rows.length === 0) {
            return null;
        }

        const module = moduleResult.rows[0];
        const contentResult = await query('SELECT content_id, content_type, content, content_order FROM module_contents WHERE module_id = $1 ORDER BY content_order ASC', [moduleId]);

        return {
            ...module,
            contents: contentResult.rows
        };
    }
}

export default ChatbotModel;