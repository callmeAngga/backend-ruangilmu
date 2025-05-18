const Quiz = require('../models/quizModel');
const Certificate = require('../models/certificateModel');
const AppError = require('../utils/appError');
const httpStatus = require('../constants/httpStatus');

const getQuizByModule = async (moduleId) => {
    const quiz = await Quiz.getQuizByModuleId(moduleId);
    if (!quiz || quiz.length === 0) {
        throw new AppError('Kuis tidak ditemukan untuk modul ini', httpStatus.NOT_FOUND, 'quiz_id');
    }
    
    return await Quiz.getQuizWithQuestionsAndOptions(quiz.quiz_id);
};

const getFinalExam = async (courseId) => {
    const finalExam = await Quiz.getFinalExamByCourseId(courseId);
    if (!finalExam || finalExam.length === 0) {
        throw new AppError('Ujian akhir tidak ditemukan untuk course ini', httpStatus.NOT_FOUND, 'quiz_id');
    }
    
    return await Quiz.getQuizWithQuestionsAndOptions(finalExam.quiz_id);
};

const getQuizResult = async (userId, quizId) => {
    return await Quiz.getQuizResult(userId, quizId);
};

const evaluateAndSaveQuizResult = async (userId, moduleId, answers) => {
    // Dapatkan kuis untuk modul
    const quiz = await Quiz.getQuizByModuleId(moduleId);
    if (!quiz || quiz.length === 0) {
        throw new AppError('Kuis tidak ditemukan untuk modul ini', httpStatus.NOT_FOUND, 'quiz_id');
    }
    
    // Dapatkan semua pertanyaan kuis
    const questions = await Quiz.getQuizQuestions(quiz.quiz_id);
    
    // Evaluasi jawaban
    let correctCount = 0;
    
    for (let answer of answers) {
        const question = questions.find(q => q.question_id === answer.questionId);
        
        if (question && question.correct_option_id === answer.optionId) {
            correctCount++;
        }
    }
    
    // Hitung skor
    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    // Tentukan apakah lulus atau tidak
    const passed = score >= quiz.pass_score;
    
    // Simpan hasil
    await Quiz.saveQuizResult(userId, quiz.quiz_id, score, passed);
    
    return {
        score,
        passed,
        correctAnswers: correctCount,
        totalQuestions
    };
};

const evaluateAndSaveFinalExamResult = async (userId, courseId, answers) => {
    // Dapatkan ujian akhir
    const finalExam = await Quiz.getFinalExamByCourseId(courseId);
    if (!finalExam || finalExam.length === 0) {
        throw new AppError('Ujian akhir tidak ditemukan untuk course ini', httpStatus.NOT_FOUND, 'quiz_id');
    }
    
    // Dapatkan semua pertanyaan ujian
    const questions = await Quiz.getQuizQuestions(finalExam.quiz_id);
    if (!questions || questions.length === 0) {
        throw new AppError('Tidak ada pertanyaan untuk ujian akhir ini', httpStatus.NOT_FOUND, 'question_id');
    }
    
    // Evaluasi jawaban
    let correctCount = 0;
    
    for (let answer of answers) {
        const question = questions.find(q => q.question_id === answer.questionId);
        
        if (question && question.correct_option_id === answer.optionId) {
            correctCount++;
        }
    }
    
    // Hitung skor
    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    // Tentukan apakah lulus atau tidak
    const passed = score >= finalExam.pass_score;
    
    // Simpan hasil
    await Quiz.saveQuizResult(userId, finalExam.quiz_id, score, passed);
    
    return {
        score,
        passed,
        correctAnswers: correctCount,
        totalQuestions
    };
};

const createCertificate = async (userId, courseId, finalScore) => {
    return await Certificate.createCertificate(userId, courseId, finalScore);
};

module.exports = {
    getQuizByModule,
    getFinalExam,
    getQuizResult,
    evaluateAndSaveQuizResult,
    evaluateAndSaveFinalExamResult,
    createCertificate
};