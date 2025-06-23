import fs from 'fs';
import path from 'path';
import httpStatus from '../constants/httpStatus.js';
import Admin from '../models/adminModel.js';
import AppError from '../utils/appError.js';
import { uploadDir, deleteFileIfExists } from '../middleware/uploadCourseMiddleware.js';
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

const getAllCourses = async (page = 1, limit = 6, search = '') => {
    const offset = (page - 1) * limit;
    const courses = await Admin.getAllCourses(limit, offset, search);
    const totalCount = await Admin.getCoursesCount(search);

    return {
        data: courses,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalItems: totalCount,
            itemsPerPage: limit,
            hasNextPage: page < Math.ceil(totalCount / limit),
            hasPrevPage: page > 1
        }
    };
}

const getCourseById = async (courseId) => {
    return await Admin.getCourseById(courseId);
}

const createCourse = async (courseData, files) => {
    console.log("Masuk createCourse");
    const { course_name, course_description, course_price, course_slug, status = 'pending' } = courseData;

    let course_image_profile_name = null;
    let course_image_cover_name = null;

    // Generate unique filename components untuk create course
    const firstWordCourseName = course_name.split(' ')[0].toLowerCase();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 5); // 3 karakter random

    try {
        // Process profile image jika ada
        if (files && files.course_image_profile && files.course_image_profile[0]) {
            const oldProfilePath = files.course_image_profile[0].path;
            const profileExtension = path.extname(files.course_image_profile[0].originalname);
            course_image_profile_name = `${firstWordCourseName}-profile-${timestamp}-${randomSuffix}${profileExtension}`;
            const newProfilePath = path.join(uploadDir, course_image_profile_name);
            fs.renameSync(oldProfilePath, newProfilePath);
        }

        // Process cover image jika ada
        if (files && files.course_image_cover && files.course_image_cover[0]) {
            const oldCoverPath = files.course_image_cover[0].path;
            const coverExtension = path.extname(files.course_image_cover[0].originalname);
            course_image_cover_name = `${firstWordCourseName}-cover-${timestamp}-${randomSuffix}${coverExtension}`;
            const newCoverPath = path.join(uploadDir, course_image_cover_name);
            fs.renameSync(oldCoverPath, newCoverPath);
        }

        // Data untuk disimpan ke database
        const dataToSave = {
            course_name,
            course_description,
            course_price,
            course_slug,
            status,
            course_image_profile: course_image_profile_name, // null jika tidak ada file
            course_image_cover: course_image_cover_name      // null jika tidak ada file
        };

        const newCourse = await Admin.createCourse(dataToSave);
        return newCourse;

    } catch (error) {
        // Cleanup files jika terjadi error
        if (course_image_profile_name) deleteFileIfExists(course_image_profile_name);
        if (course_image_cover_name) deleteFileIfExists(course_image_cover_name);
        throw new AppError('Gagal memproses gambar atau membuat kursus.', httpStatus.INTERNAL_SERVER_ERROR, 'file_upload', error.message);
    }
}

const updateCourse = async (courseId, courseData, files) => {
    const existingCourse = await Admin.getCourseById(courseId);
    if (!existingCourse) {
        throw new AppError('Kursus tidak ditemukan.', httpStatus.NOT_FOUND, 'course_id');
    }

    const { course_name } = courseData;
    let updatedCourseData = { ...courseData };
    let profileImageToUpdate = existingCourse.course_image_profile;
    let coverImageToUpdate = existingCourse.course_image_cover;

    const firstWordCourseName = (course_name || existingCourse.course_name).split(' ')[0].toLowerCase();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 5);

    try {
        // Update profile image jika ada file baru
        if (files && files.course_image_profile && files.course_image_profile[0]) {
            // Hapus file lama jika ada
            if (existingCourse.course_image_profile) {
                deleteFileIfExists(existingCourse.course_image_profile);
            }

            const oldProfilePath = files.course_image_profile[0].path;
            const profileExtension = path.extname(files.course_image_profile[0].originalname);
            profileImageToUpdate = `${firstWordCourseName}-profile-${timestamp}-${randomSuffix}${profileExtension}`;
            const newProfilePath = path.join(uploadDir, profileImageToUpdate);
            fs.renameSync(oldProfilePath, newProfilePath);
            updatedCourseData.course_image_profile = profileImageToUpdate;
        }

        // Update cover image jika ada file baru
        if (files && files.course_image_cover && files.course_image_cover[0]) {
            // Hapus file lama jika ada
            if (existingCourse.course_image_cover) {
                deleteFileIfExists(existingCourse.course_image_cover);
            }

            const oldCoverPath = files.course_image_cover[0].path;
            const coverExtension = path.extname(files.course_image_cover[0].originalname);
            coverImageToUpdate = `${firstWordCourseName}-cover-${timestamp}-${randomSuffix}${coverExtension}`;
            const newCoverPath = path.join(uploadDir, coverImageToUpdate);
            fs.renameSync(oldCoverPath, newCoverPath);
            updatedCourseData.course_image_cover = coverImageToUpdate;
        }

        const updatedCourse = await Admin.updateCourse(courseId, updatedCourseData);
        return updatedCourse;

    } catch (error) {
        // Cleanup files baru jika terjadi error
        if (files && files.course_image_profile && files.course_image_profile[0] && profileImageToUpdate !== existingCourse.course_image_profile) {
            deleteFileIfExists(profileImageToUpdate);
        }
        if (files && files.course_image_cover && files.course_image_cover[0] && coverImageToUpdate !== existingCourse.course_image_cover) {
            deleteFileIfExists(coverImageToUpdate);
        }
        throw new AppError('Gagal mengupdate kursus atau memproses gambar.', httpStatus.INTERNAL_SERVER_ERROR, 'server', error.message);
    }
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