import httpStatus from '../constants/httpStatus.js';
import adminService from '../services/adminService.js';
import { successResponse, failResponse, errorResponse } from '../utils/responseUtil.js';
import AppError from '../utils/appError.js';   

const getDashboardKPIs = async (req, res) => {
    try {
        const kpis = await adminService.getDashboardKPIs();
        return successResponse(res, httpStatus.OK, 'Dashboard KPIs retrieved successfully', kpis);
    } catch (error) {
        console.error('Error retrieving dashboard KPIs:', error);
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
    }
}

const getUserGrowthChart = async (req, res) => {
    try {
        const { months = 12 } = req.query;
        const chartData = await adminService.getUserGrowthChart(parseInt(months));
        return successResponse(res, httpStatus.OK, 'User growth chart data retrieved successfully', chartData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
    }
}

const getCertificatesPerCourse = async (req, res) => {
    try {
        const certificatesData = await adminService.getCertificatesPerCourse();
        return successResponse(res, httpStatus.OK, 'Certificates per course data retrieved successfully', certificatesData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
    }
}

const getCourseReviewsSentiment = async (req, res) => {
    try {
        const reviewsSentimentData = await adminService.getCourseReviewsSentiment();
        return successResponse(res, httpStatus.OK, 'Course reviews sentiment data retrieved successfully', reviewsSentimentData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
    }
}

const getUsersPerClass = async (req, res) => {
    try {
        const usersPerClassData = await adminService.getUsersPerClass();
        return successResponse(res, httpStatus.OK, 'Users per class data retrieved successfully', usersPerClassData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
    }
}

const getCourseTable = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'enrolled_users', sortOrder = 'asc' } = req.query;
        const coursesTableData = await adminService.getCoursesTable({
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy,
            sortOrder
        });
        return successResponse(res, httpStatus.OK, 'Courses table data retrieved successfully', coursesTableData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
    }
}

const getTopPerformUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const topUsersData = await adminService.getTopPerformUsers({
            page: parseInt(page),
            limit: parseInt(limit)
        });
        return successResponse(res, httpStatus.OK, 'Top performing users data retrieved successfully', topUsersData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
    }
}

const getAllDashboardData = async (req, res) => {
    try {
        const dashboardData = await adminService.getAllDashboardData();
        return successResponse(res, httpStatus.OK, 'All dashboard data retrieved successfully', dashboardData);
    } catch (error) {
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, error.message);
        }
        return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
    }
}

export default {
    getDashboardKPIs,
    getUserGrowthChart,
    getCertificatesPerCourse,
    getCourseReviewsSentiment,
    getUsersPerClass,
    getCourseTable,
    getTopPerformUsers,
    getAllDashboardData
}
