import httpStatus from '../constants/httpStatus.js';
import Quiz from '../models/quizModel.js';
import Module from '../models/moduleModel.js';
import Course from '../models/courseModel.js';
import AppError from '../utils/appError.js';

const getModulesByCourse = async (userId, courseId) => {
    const course = await Course.getCourseById(courseId);
    if (!course) {
        throw new AppError(`Course tidak ditemukan, tidak ada course dengan ID ${courseId}`, httpStatus.NOT_FOUND, 'course_id');
    }

    const modules = await Module.getModulesByCourseId(courseId);
    if (!modules || modules.length === 0) {
        throw new AppError('Course tidak atau belum memiliki daftar module', httpStatus.NOT_FOUND, 'module_id');
    }

    const progress = await Module.getUserProgress(userId, courseId);
    
    // Merge progress information with modules
    return modules.map(module => {
        const moduleProgress = progress.find(p => p.module_id === module.module_id) || {};
        return {
            ...module,
            completed: moduleProgress.completed || false,
            completed_at: moduleProgress.completed_at || null
        };
    });
};

const getModuleWithContent = async (moduleId) => {
    const module = await Module.getModuleById(moduleId);
    const content = await Module.getModuleContent(moduleId);

    module.content = content;
    return module;
};

const canAccessModule = async (userId, courseId, moduleId) => {
    const cekCourse = await Module.getModulesByCourseId(courseId);
    if (!cekCourse || cekCourse.length === 0) {
        throw new AppError('Course tidak memiliki modul', httpStatus.NOT_FOUND, 'course_id');
    }

    const module = await Module.checkModulePartOfCourse(moduleId, courseId);
    if (!module || module.length === 0) {
        throw new AppError(`Tidak ada module dengan ID ${moduleId} pada course ini`, httpStatus.NOT_FOUND, 'module_id');
    }
    
    // Jika bukan modul pertama, cek apakah modul sebelumnya sudah diselesaikan
    if (module.module_order > 1) {
        const previousModuleCompleted = await Module.checkPreviousModuleCompletion(
            userId,
            courseId,
            module.module_order
        );
        
        if (!previousModuleCompleted) {
            return {
                allowed: false,
                message: 'Anda harus menyelesaikan modul sebelumnya terlebih dahulu'
            };
        }
    }
    
    return { allowed: true };
};

const isModuleCompleted = async (userId, moduleId) => {
    return await Module.checkModuleCompletion(userId, moduleId);
};

const getModuleQuiz = async (moduleId) => {
    return await Quiz.getQuizByModuleId(moduleId);
};

const isQuizCompleted = async (userId, quizId) => {
    return await Quiz.checkQuizCompletion(userId, quizId);
};

const completeModule = async (userId, moduleId) => {
    return await Module.markModuleAsCompleted(userId, moduleId);
};

const getNextModule = async (courseId, moduleId) => {
    const currentModule = await Module.getModuleById(moduleId);
    if (!currentModule) {
        throw new AppError(`Module tidak ditemukan, tidak ada module dengan ID ${moduleId}`, httpStatus.NOT_FOUND, 'module_id');
    }
    
    return await Module.getNextModule(courseId, currentModule.module_order);
};

const getAllModulesCompletion = async (userId, courseId) => {
    return await Module.getAllCompletedModules(userId, courseId);
};

export default {
    getModulesByCourse,
    getModuleWithContent,
    canAccessModule,
    isModuleCompleted,
    getModuleQuiz,
    isQuizCompleted,
    completeModule,
    getNextModule,
    getAllModulesCompletion
};