const httpStatus = require('../constants/httpStatus');
const moduleService = require('../services/moduleService');

exports.getModulesByCourse = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = req.user.id;
        
        const modules = await moduleService.getModulesByCourse(userId, courseId);
        
        res.status(httpStatus.OK).json({
            status: 'success',
            data: modules
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengambil data modul'
        });
    }
};

exports.getModuleById = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const moduleId = parseInt(req.params.moduleId);
        const userId = req.user.id;
        
        // Verifikasi apakah modul sebelumnya sudah diselesaikan
        const canAccess = await moduleService.canAccessModule(userId, courseId, moduleId);
        
        if (!canAccess.allowed) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'error',
                message: canAccess.message
            });
        }
        
        const moduleData = await moduleService.getModuleWithContent(moduleId);
        
        if (!moduleData) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'error',
                message: 'Modul tidak ditemukan'
            });
        }
        
        // Cek apakah modul sudah diselesaikan oleh pengguna
        const isCompleted = await moduleService.isModuleCompleted(userId, moduleId);
        moduleData.isCompleted = isCompleted;
        
        // Dapatkan informasi kuis jika ada
        const quiz = await moduleService.getModuleQuiz(moduleId);
        if (quiz) {
            moduleData.hasQuiz = true;
            moduleData.quizCompleted = await moduleService.isQuizCompleted(userId, quiz.quiz_id);
        } else {
            moduleData.hasQuiz = false;
        }
        
        res.status(httpStatus.OK).json({
            status: 'success',
            data: moduleData
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengambil detail modul'
        });
    }
};

exports.completeModule = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const moduleId = parseInt(req.params.moduleId);
        const userId = req.user.id;
        
        // Verifikasi apakah modul sebelumnya sudah diselesaikan
        const canAccess = await moduleService.canAccessModule(userId, courseId, moduleId);
        
        if (!canAccess.allowed) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'error',
                message: canAccess.message
            });
        }
        
        // Cek apakah ada kuis di modul ini yang harus diselesaikan
        const quiz = await moduleService.getModuleQuiz(moduleId);
        if (quiz) {
            const quizCompleted = await moduleService.isQuizCompleted(userId, quiz.quiz_id);
            
            if (!quizCompleted) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Anda harus menyelesaikan kuis modul terlebih dahulu'
                });
            }
        }
        
        // Tandai modul sebagai selesai
        await moduleService.completeModule(userId, moduleId);
        
        // Cek apakah ada modul berikutnya
        const nextModule = await moduleService.getNextModule(courseId, moduleId);
        
        res.status(httpStatus.OK).json({
            status: 'success',
            message: 'Modul berhasil diselesaikan',
            data: {
                nextModule: nextModule || null
            }
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal menandai modul sebagai selesai'
        });
    }
};