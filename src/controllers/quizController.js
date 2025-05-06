const httpStatus = require('../constants/httpStatus');
const quizService = require('../services/quizService');
const moduleService = require('../services/moduleService');

exports.getModuleQuiz = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const moduleId = parseInt(req.params.moduleId);
        const userId = req.user.id;
        
        // Verifikasi apakah modul dapat diakses
        const canAccess = await moduleService.canAccessModule(userId, courseId, moduleId);
        
        if (!canAccess.allowed) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'error',
                message: canAccess.message
            });
        }
        
        // Dapatkan quiz untuk modul
        const quiz = await quizService.getQuizByModule(moduleId);
        
        if (!quiz) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'error',
                message: 'Kuis tidak ditemukan untuk modul ini'
            });
        }
        
        // Cek apakah sudah pernah mengerjakan kuis
        const quizResult = await quizService.getQuizResult(userId, quiz.quiz_id);
        
        res.status(httpStatus.OK).json({
            status: 'success',
            data: {
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
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengambil data kuis'
        });
    }
};

exports.submitModuleQuiz = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const moduleId = parseInt(req.params.moduleId);
        const userId = req.user.id;
        const { answers } = req.body;
        
        if (!answers || !Array.isArray(answers)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: 'Format jawaban tidak valid'
            });
        }
        
        // Verifikasi akses ke modul
        const canAccess = await moduleService.canAccessModule(userId, courseId, moduleId);
        
        if (!canAccess.allowed) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'error',
                message: canAccess.message
            });
        }
        
        // Periksa dan simpan hasil kuis
        const result = await quizService.evaluateAndSaveQuizResult(userId, moduleId, answers);
        
        res.status(httpStatus.OK).json({
            status: 'success',
            data: {
                score: result.score,
                passed: result.passed,
                correctAnswers: result.correctAnswers,
                totalQuestions: result.totalQuestions
            }
        });
    } catch (error) {
        console.error(error);
        if (error.message === 'Kuis tidak ditemukan') {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'error',
                message: error.message
            });
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengirim jawaban kuis'
        });
    }
};

exports.getFinalExam = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = req.user.id;
        
        // Cek apakah semua modul sudah diselesaikan
        const moduleCompletion = await moduleService.getAllModulesCompletion(userId, courseId);
        
        if (moduleCompletion.completedCount < moduleCompletion.totalCount) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'error',
                message: 'Anda harus menyelesaikan semua modul terlebih dahulu',
                data: {
                    completedModules: moduleCompletion.completedCount,
                    totalModules: moduleCompletion.totalCount
                }
            });
        }
        
        // Dapatkan ujian akhir
        const finalExam = await quizService.getFinalExam(courseId);
        
        if (!finalExam) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'error',
                message: 'Ujian akhir tidak ditemukan'
            });
        }
        
        // Cek apakah sudah pernah mengerjakan ujian akhir
        const examResult = await quizService.getQuizResult(userId, finalExam.quiz_id);
        
        res.status(httpStatus.OK).json({
            status: 'success',
            data: {
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
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengambil data ujian akhir'
        });
    }
};

exports.submitFinalExam = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = req.user.id;
        const { answers } = req.body;
        
        if (!answers || !Array.isArray(answers)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: 'Format jawaban tidak valid'
            });
        }
        
        // Cek apakah semua modul sudah diselesaikan
        const moduleCompletion = await moduleService.getAllModulesCompletion(userId, courseId);
        
        if (moduleCompletion.completedCount < moduleCompletion.totalCount) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'error',
                message: 'Anda harus menyelesaikan semua modul terlebih dahulu'
            });
        }
        
        // Periksa dan simpan hasil ujian
        const result = await quizService.evaluateAndSaveFinalExamResult(userId, courseId, answers);
        
        // Jika lulus, buat sertifikat
        if (result.passed) {
            await quizService.createCertificate(userId, courseId, result.score);
        }
        
        res.status(httpStatus.OK).json({
            status: 'success',
            data: {
                score: result.score,
                passed: result.passed,
                correctAnswers: result.correctAnswers,
                totalQuestions: result.totalQuestions,
                certificateCreated: result.passed
            }
        });
    } catch (error) {
        console.error(error);
        if (error.message === 'Ujian akhir tidak ditemukan') {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'error',
                message: error.message
            });
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengirim jawaban ujian akhir'
        });
    }
};