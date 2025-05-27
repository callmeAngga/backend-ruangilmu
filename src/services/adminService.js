const Admin = require('../models/adminModel');
const AppError = require('../utils/appError');
const httpStatus = require('../constants/httpStatus');
const { formatChartData, calculatePercentage } = require('../utils/dataUtils');
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
        console.error('Error retrieving dashboard KPIs:', error);
        throw new AppError('Failed to retrieve dashboard KPIs', httpStatus.INTERNAL_SERVER_ERROR, 'dashboard');
    }
}

const getUserGrowthChart = async (months = 12) => {
    try {
        const chartData = await Admin.getUserGrowthByMonth(months);
        return formatChartData(chartData, 'line');
    } catch (error) {
        throw new AppError('Failed to retrieve user growth chart', httpStatus.INTERNAL_SERVER_ERROR, 'userGrowth');
    }
}

const getCertificatesPerCourse = async () => {
    try {
        const certificatesData = await Admin.getCertificatesPerCourse();
        return formatChartData(certificatesData, 'bar');
    } catch (error) {
        throw new AppError('Failed to retrieve certificates per course', httpStatus.INTERNAL_SERVER_ERROR, 'certificates');
    }
}

const getCourseReviewsSentiment = async () => {
    try {
        const reviewsSentiment = await Admin.getReviewsSentimentByCourse();
        return formatChartData(reviewsSentiment, 'pie');
    } catch (error) {
        throw new AppError('Failed to retrieve course reviews sentiment', httpStatus.INTERNAL_SERVER_ERROR, 'reviewsSentiment');
    }
}

const getUsersPerClass = async () => {
    try {
        const usersPerClassData = await Admin.getUsersPerClass();
        return formatChartData(usersPerClassData, 'bar');
    } catch (error) {
        throw new AppError('Failed to retrieve users per class', httpStatus.INTERNAL_SERVER_ERROR, 'usersPerClass');
    }
}

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
        console.error('Error retrieving courses table:', error);
        throw new AppError('Failed to retrieve courses table', httpStatus.INTERNAL_SERVER_ERROR, 'coursesTable');
    }
}

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
}

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
}

module.exports = {
    getDashboardKPIs,
    getUserGrowthChart,
    getCertificatesPerCourse,
    getCourseReviewsSentiment,
    getUsersPerClass,
    getCoursesTable,
    getTopPerformUsers,
    getAllDashboardData
};