const db = require('../db');

class Quiz {
    static async getQuizByModuleId(module_id) {
        const result = await db.query('SELECT * FROM quizzes WHERE module_id = $1', [module_id]);
        return result.rows[0];
    }

    static async getFinalExamByCourseId(course_id) {
        const result = await db.query(
            'SELECT * FROM quizzes WHERE course_id = $1 AND is_final_exam = true',
            [course_id]
        );
        return result.rows[0];
    }

    static async getQuizQuestions(quiz_id) {
        const result = await db.query(
            'SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY question_order',
            [quiz_id]
        );
        return result.rows;
    }

    static async getQuestionOptions(question_id) {
        const result = await db.query(
            'SELECT * FROM quiz_options WHERE question_id = $1 ORDER BY option_order',
            [question_id]
        );
        return result.rows;
    }

    static async saveQuizResult(user_id, quiz_id, score, passed) {
        const result = await db.query(
            `INSERT INTO user_quiz_results 
            (user_id, quiz_id, score, passed, completed_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (user_id, quiz_id) 
            DO UPDATE SET score = $3, passed = $4, completed_at = NOW()
            RETURNING *`,
            [user_id, quiz_id, score, passed]
        );
        return result.rows[0];
    }

    static async getQuizResult(user_id, quiz_id) {
        const result = await db.query(
            'SELECT * FROM user_quiz_results WHERE user_id = $1 AND quiz_id = $2',
            [user_id, quiz_id]
        );
        return result.rows[0];
    }

    static async checkQuizCompletion(user_id, quiz_id) {
        const result = await db.query(
            'SELECT * FROM user_quiz_results WHERE user_id = $1 AND quiz_id = $2 AND passed = true',
            [user_id, quiz_id]
        );
        return result.rows.length > 0;
    }

    static async getQuizWithQuestionsAndOptions(quiz_id) {
        // Get quiz details
        const quizResult = await db.query('SELECT * FROM quizzes WHERE quiz_id = $1', [quiz_id]);
        const quiz = quizResult.rows[0];
        
        if (!quiz) return null;
        
        // Get questions
        const questionsResult = await db.query(
            'SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY question_order',
            [quiz_id]
        );
        const questions = questionsResult.rows;
        
        // Get options for each question
        for (let question of questions) {
            const optionsResult = await db.query(
                'SELECT quiz_option_id, option_text, option_order FROM quiz_options WHERE question_id = $1 ORDER BY option_order',
                [question.question_id]
            );
            question.options = optionsResult.rows;
        }
        
        quiz.questions = questions;
        return quiz;
    }
}

module.exports = Quiz;