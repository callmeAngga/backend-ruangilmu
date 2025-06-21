import httpStatus from '../constants/httpStatus.js';
import quizService from '../services/quizService.js';
import moduleService from '../services/moduleService.js';
import AppError from '../utils/appError.js';
import { successResponse, failResponse, errorResponse } from '../utils/responseUtil.js';

const getModuleQuiz = async (req, res) => {
    try {
        const userId = req.user.id;
        const courseId = parseInt(req.params.courseId);
        const moduleId = parseInt(req.params.moduleId);

        // Verifikasi apakah modul dapat diakses
        const canAccess = await moduleService.canAccessModule(userId, courseId, moduleId);
        if (!canAccess.allowed) {
            throw new AppError(canAccess.message, httpStatus.FORBIDDEN, 'module_access');
        }

        // Dapatkan quiz untuk modul
        const quiz = await quizService.getQuizByModule(moduleId);
        if (!quiz) {
            throw new AppError('Kuis tidak ditemukan untuk modul ini', httpStatus.NOT_FOUND, 'quiz_id');
        }

        // Cek apakah sudah pernah mengerjakan kuis
        const quizResult = await quizService.getQuizResult(userId, quiz.quiz_id);

        return successResponse(
            res,
            httpStatus.OK,
            "Berhasil mendapatkan data kuis",
            {
                quiz: {
                    quiz_id: quiz.quiz_id,
                    title: quiz.title,
                    description: quiz.description,
                    time_limit: quiz.time_limit,
                    pass_score: quiz.pass_score,
                    questions: quiz.questions.map(q => ({
                        question_id: q.question_id,
                        question_text: q.question_text,
                        question_order: q.question_order,
                        options: q.options.map(o => ({
                            quiz_option_id: o.quiz_option_id,
                            option_text: o.option_text,
                            option_order: o.option_order
                        }))
                    }))
                },
                previousResult: quizResult ? {
                    score: quizResult.score,
                    passed: quizResult.passed,
                    completed_at: quizResult.completed_at
                } : null
            }
        );
    } catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mendapatkan data quiz module",
                [{
                    field: error.field,
                    message: error.message,
                }]
            );
        }

        return errorResponse(res);
    }
};

const submitModuleQuiz = async (req, res) => {
    try {
        const userId = req.user.id;
        const courseId = parseInt(req.params.courseId);
        const moduleId = parseInt(req.params.moduleId);
        const { answers } = req.body;

        if (!answers || !Array.isArray(answers)) {
            throw new AppError('Format jawaban tidak valid', httpStatus.BAD_REQUEST, 'answers');
        }

        // Verifikasi akses ke modul
        const canAccess = await moduleService.canAccessModule(userId, courseId, moduleId);
        if (!canAccess.allowed) {
            throw new AppError(canAccess.message, httpStatus.FORBIDDEN, 'module_access');
        }

        // Periksa dan simpan hasil kuis
        const result = await quizService.evaluateAndSaveQuizResult(userId, moduleId, answers);

        return successResponse(
            res,
            httpStatus.OK,
            "Berhasil mengirim jawaban kuis",
            {
                score: result.score,
                passed: result.passed,
                correctAnswers: result.correctAnswers,
                totalQuestions: result.totalQuestions
            }
        );
    } catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mengirim jawaban kuis",
                [{
                    field: error.field,
                    message: error.message,
                }]
            );
        }

        return errorResponse(res);
    }
};

const getFinalExam = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = req.user.id;

        // Cek apakah semua modul sudah diselesaikan
        const moduleCompletion = await moduleService.getAllModulesCompletion(userId, courseId);
        if (moduleCompletion.completedCount < moduleCompletion.totalCount) {
            throw new AppError('Anda harus menyelesaikan semua modul terlebih dahulu', httpStatus.FORBIDDEN, 'module_completion', {
                completedModules: moduleCompletion.completedCount,
                totalModules: moduleCompletion.totalCount
            });
        }

        // Dapatkan ujian akhir
        const finalExam = await quizService.getFinalExam(courseId);

        // Cek apakah sudah pernah mengerjakan ujian akhir
        const examResult = await quizService.getQuizResult(userId, finalExam.quiz_id);

        return successResponse(
            res,
            httpStatus.OK,
            "Berhasil mendapatkan data ujian akhir",
            {
                exam: {
                    quiz_id: finalExam.quiz_id,
                    title: finalExam.title,
                    description: finalExam.description,
                    time_limit: finalExam.time_limit,
                    pass_score: finalExam.pass_score,
                    questions: finalExam.questions.map(q => ({
                        question_id: q.question_id,
                        question_text: q.question_text,
                        question_order: q.question_order,
                        options: q.options.map(o => ({
                            quiz_option_id: o.quiz_option_id,
                            option_text: o.option_text,
                            option_order: o.option_order
                        }))
                    }))
                },
                previousResult: examResult ? {
                    score: examResult.score,
                    passed: examResult.passed,
                    completed_at: examResult.completed_at
                } : null
            }
        );
    } catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mendapatkan data ujian akhir",
                [{
                    field: error.field,
                    message: error.message,
                }]
            );
        }

        return errorResponse(res);
    }
};

const submitFinalExam = async (req, res) => {
    try {
        const userId = req.user.id;
        const courseId = parseInt(req.params.courseId);
        const { answers } = req.body;

        if (!answers || !Array.isArray(answers)) {
            throw new AppError('Format jawaban tidak valid', httpStatus.BAD_REQUEST, 'answers');
        }

        // Cek apakah semua modul sudah diselesaikan
        const moduleCompletion = await moduleService.getAllModulesCompletion(userId, courseId);
        if (moduleCompletion.completedCount < moduleCompletion.totalCount) {
            throw new AppError('Anda harus menyelesaikan semua modul terlebih dahulu', httpStatus.FORBIDDEN, 'module_completion', {
                completedModules: moduleCompletion.completedCount,
                totalModules: moduleCompletion.totalCount
            });
        }

        // Periksa dan simpan hasil ujian
        const result = await quizService.evaluateAndSaveFinalExamResult(userId, courseId, answers);

        // Jika lulus, buat sertifikat
        if (result.passed) {
            await quizService.createCertificate(userId, courseId, result.score);
        }

        return successResponse(
            res,
            httpStatus.OK,
            "Berhasil mengirim jawaban ujian akhir",
            {
                score: result.score,
                passed: result.passed,
                correctAnswers: result.correctAnswers,
                totalQuestions: result.totalQuestions,
                certificateCreated: result.passed
            }
        )
    } catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mengirim jawaban ujian akhir",
                [{
                    field: error.field,
                    message: error.message,
                }]
            );
        }

        return errorResponse(res);
    }
};

export default {
    getModuleQuiz,
    submitModuleQuiz,
    getFinalExam,
    submitFinalExam
};