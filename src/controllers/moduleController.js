import httpStatus from '../constants/httpStatus.js';
import moduleService from '../services/moduleService.js';
import AppError from '../utils/appError.js';
import { successResponse, failResponse, errorResponse } from '../utils/responseUtil.js';

const getModulesByCourse = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = req.user.id;
        
        const modules = await moduleService.getModulesByCourse(userId, courseId);
        
        return successResponse(res, httpStatus.OK , 'Berhasil mendapatkan modul', modules);
    } catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mendapatkan modul",
                [{
                    field: error.field,
                    message: error.message,
                }]
            );
        }

        return errorResponse(res);
    }
};

const getModuleById = async (req, res) => {
    try {
        const userId = req.user.id;
        const courseId = parseInt(req.params.courseId);
        const moduleId = parseInt(req.params.moduleId);
        
        const canAccess = await moduleService.canAccessModule(userId, courseId, moduleId);
        if (!canAccess.allowed) {
            throw new AppError(canAccess.message, httpStatus.FORBIDDEN, 'module_access');
        }
        
        const moduleData = await moduleService.getModuleWithContent(moduleId);
        if (moduleData.length === 0) {
            throw new AppError('Modul tidak atau belum memiliki konten untuk ditampilkan', httpStatus.NOT_FOUND, 'module_id');
        }
        
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
        
        return successResponse(res, httpStatus.OK, 'Berhasil mendapatkan modul', moduleData);
    } catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mendapatkan modul",
                [{
                    field: error.field,
                    message: error.message,
                }]
            );
        }

        return errorResponse(res);
    }
};

const completeModule = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId);
        const moduleId = parseInt(req.params.moduleId);
        const userId = req.user.id;
        
        // Verifikasi apakah modul sebelumnya sudah diselesaikan
        const canAccess = await moduleService.canAccessModule(userId, courseId, moduleId);
        
        if (!canAccess.allowed) {
            throw new AppError(canAccess.message, httpStatus.FORBIDDEN, 'module_access');
        }
        
        // Cek apakah ada kuis di modul ini yang harus diselesaikan
        const quiz = await moduleService.getModuleQuiz(moduleId);
        if (quiz) {
            const quizCompleted = await moduleService.isQuizCompleted(userId, quiz.quiz_id);
            
            if (!quizCompleted) {
                throw new AppError('Anda harus menyelesaikan kuis sebelum bisa menyelesaikan modul', httpStatus.FORBIDDEN, 'quiz_completion');
            }
        }
        
        // Tandai modul sebagai selesai
        await moduleService.completeModule(userId, moduleId);
        
        // Cek apakah ada modul berikutnya
        const nextModule = await moduleService.getNextModule(courseId, moduleId);
        
        return successResponse(res, httpStatus.OK, 'Modul berhasil diselesaikan', {
            message: 'Modul berhasil diselesaikan',
            nextModule: nextModule ? {
                moduleId: nextModule.module_id,
                moduleName: nextModule.module_name,
                moduleOrder: nextModule.module_order
            } : null
        });
    } catch (error) {
        console.error(error);
        
        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal menyelesaikan modul",
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
    getModulesByCourse,
    getModuleById,
    completeModule
};