import httpStatus from '../constants/httpStatus.js';
import Admin from '../models/adminModel.js';
import AppError from '../utils/appError.js';
import { formatChartData, calculatePercentage } from '../utils/dataUtils.js';

const getDashboardKPIs = async () => {
    try {
        const [
            totalUsers,
            totalCourses,
            completionRatio,
            reviewStats
        ] = await Promise.all([
            Admin.getTotalUsers(),
            Admin.getTotalCourses(),
            Admin.getCourseCompletionRatio(),
            Admin.getReviewStats()
        ]);

        return {
            totalUsers,
            totalCourses,
            completionRatio: parseFloat(completionRatio.toFixed(2)),
            reviewStats: {
                totalReviews: reviewStats.total,
                positiveReviews: reviewStats.positive,
                negativeReviews: reviewStats.negative
            }
        };
    } catch (error) {
        throw new AppError('Failed to retrieve dashboard KPIs', httpStatus.INTERNAL_SERVER_ERROR, 'dashboard');
    }
};

const getUserGrowthChart = async (months = 12) => {
    try {
        const chartData = await Admin.getUserGrowthByMonth(months);
        return formatChartData(chartData, 'line');
    } catch (error) {
        throw new AppError('Failed to retrieve user growth chart', httpStatus.INTERNAL_SERVER_ERROR, 'userGrowth');
    }
};

const getCertificatesPerCourse = async () => {
    try {
        const certificatesData = await Admin.getCertificatesPerCourse();
        return formatChartData(certificatesData, 'bar');
    } catch (error) {
        throw new AppError('Failed to retrieve certificates per course', httpStatus.INTERNAL_SERVER_ERROR, 'certificates');
    }
};

const getCourseReviewsSentiment = async () => {
    try {
        const reviewsSentiment = await Admin.getReviewsSentimentByCourse();
        return formatChartData(reviewsSentiment, 'pie');
    } catch (error) {
        throw new AppError('Failed to retrieve course reviews sentiment', httpStatus.INTERNAL_SERVER_ERROR, 'reviewsSentiment');
    }
};

const getUsersPerClass = async () => {
    try {
        const usersPerClassData = await Admin.getUsersPerClass();
        return formatChartData(usersPerClassData, 'bar');
    } catch (error) {
        throw new AppError('Failed to retrieve users per class', httpStatus.INTERNAL_SERVER_ERROR, 'usersPerClass');
    }
};

const getCoursesTable = async (options) => {
    try {
        const { page, limit, sortBy, sortOrder } = options;
        const offset = (page - 1) * limit;
        const [courses, totalCount] = await Promise.all([
            Admin.getCoursesTableData(limit, offset, sortBy, sortOrder),
            Admin.getTotalCoursesCount()
        ]);

        const processedCourses = courses.map(course => ({
            ...course,
            satisfaction_percentage: calculatePercentage(
                course.positive_reviews,
                course.total_reviews
            )
        }));

        return {
            data: processedCourses,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit,
                hasNextPage: page < Math.ceil(totalCount / limit),
                hasPrevPage: page > 1
            }
        }
    } catch (error) {
        throw new AppError('Failed to retrieve courses table', httpStatus.INTERNAL_SERVER_ERROR, 'coursesTable');
    }
};

const getTopPerformUsers = async (options) => {
    try {
        const { page, limit } = options;
        const offset = (page - 1) * limit;
        const [topUsers, totalCount] = await Promise.all([
            Admin.getTopPerformUsersData(limit, offset),
            Admin.getTotalUsersCount()
        ]);

        return {
            data: topUsers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit,
                hasNextPage: page < Math.ceil(totalCount / limit),
                hasPrevPage: page > 1
            }
        }
    } catch (error) {
        throw new AppError('Failed to retrieve top performing users', httpStatus.INTERNAL_SERVER_ERROR, 'topPerformUsers');
    }
};

const getAllDashboardData = async () => {
    try {
        const [
            kpis,
            userGrowth,
            certificates,
            reviewSentiment,
            usersPerClass,
            coursesTable,
            topUsers
        ] = await Promise.all([
            await getDashboardKPIs(),
            await getUserGrowthChart(12),
            await getCertificatesPerCourse(),
            await getCourseReviewsSentiment(),
            await getUsersPerClass(),
            await getCoursesTable({ page: 1, limit: 10, sortBy: 'enrolled_users', sortOrder: 'asc' }),
            await getTopPerformUsers({ page: 1, limit: 10 })
        ]);

        return {
            kpis,
            charts: {
                userGrowth,
                certificates,
                reviewSentiment,
                usersPerClass
            },
            tables: {
                courses: coursesTable,
                topUsers
            }
        };
    } catch (error) {
        throw new AppError('Failed to retrieve all dashboard data', httpStatus.INTERNAL_SERVER_ERROR, 'allDashboardData');
    }
};

const getAllCourses = async () => {
    return await Admin.getAllCourses();
}

const getCourseById = async (courseId) => {
    return await Admin.getCourseById(courseId);
}

const createCourse = async (courseData) => {
    return await Admin.createCourse(courseData);
}

const updateCourse = async (courseId, courseData) => {
    return await Admin.updateCourse(courseId, courseData);
}

const deleteCourse = async (courseId) => {
    const course = await Admin.getCourseById(courseId);
    if (!course) {
        return null;
    }

    return await Admin.deleteCourse(courseId);
}

const getModulesByCourse = async (courseId) => {
    const course = await Admin.getCourseById(courseId); 
    if (!course) {
        throw new AppError('Failed to retrieve modules by course', httpStatus.NOT_FOUND, 'course');
    }

    return await Admin.getModulesByCourse(courseId);
}

const getModuleById = async (moduleId) => {
    return await Admin.getModuleById(moduleId);
}

const createModule = async (moduleData) => {
    const course = await Admin.getCourseById(moduleData.course_id); 
    if (!course) {
        throw new AppError('Failed to create module', httpStatus.NOT_FOUND, 'course');
    }

    return await Admin.createModule(moduleData);
}

const updateModule = async (moduleId, moduleData) => {
    return await Admin.updateModule(moduleId, moduleData);
}

const deleteModule = async (moduleId) => {
    const module = await Admin.getModuleById(moduleId);
    if (!module) {
        return null;
    }

    return await Admin.deleteModule(moduleId);
}

const getContentsByModule = async (moduleId) => {
    const module = await Admin.getModuleById(moduleId);
    if (!module) {
        throw new AppError('Failed to retrieve contents by module', httpStatus.NOT_FOUND, 'module');
    }

    return await Admin.getContentsByModule(moduleId);
}

const getContentById = async (contentId) => {
    return await Admin.getContentById(contentId);
}

const createContent = async (contentData) => {
    const module = await Admin.getModuleById(contentData.module_id);
    if (!module) {
        throw new AppError('Failed to create content', httpStatus.NOT_FOUND, 'module');
    }

    return await Admin.createContent(contentData);
}

const updateContent = async (contentId, contentData) => {
    return await Admin.updateContent(contentId, contentData);
}

const deleteContent = async (contentId) => {
    const content = await Admin.getContentById(contentId);
    if (!content) {
        return null;
    }

    return await Admin.deleteContent(contentId);
}

export default {
    getDashboardKPIs,
    getUserGrowthChart,
    getCertificatesPerCourse,
    getCourseReviewsSentiment,
    getUsersPerClass,
    getCoursesTable,
    getTopPerformUsers,
    getAllDashboardData,
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getModulesByCourse,
    getModuleById,
    createModule,
    updateModule,
    deleteModule,
    getContentsByModule,
    getContentById,
    createContent,
    updateContent,
    deleteContent
}