const Module = require('../models/moduleModel');
const Quiz = require('../models/quizModel');

const getModulesByCourse = async (userId, courseId) => {
    const modules = await Module.getModulesByCourseId(courseId);
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
    
    if (!module) {
        return null;
    }
    
    const content = await Module.getModuleContent(moduleId);
    module.content = content;
    
    return module;
};

const canAccessModule = async (userId, courseId, moduleId) => {
    const module = await Module.getModuleById(moduleId);
    
    if (!module) {
        throw new Error('Modul tidak ditemukan');
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
        throw new Error('Modul tidak ditemukan');
    }
    
    return await Module.getNextModule(courseId, currentModule.module_order);
};

const getAllModulesCompletion = async (userId, courseId) => {
    return await Module.getAllCompletedModules(userId, courseId);
};

module.exports = {
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