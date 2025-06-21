import httpStatus from '../constants/httpStatus.js';
import courseService from '../services/courseService.js';
import AppError from '../utils/appError.js';
import { successResponse, errorResponse, failResponse } from '../utils/responseUtil.js';

const getAllCourses = async (req, res) => {
    try {
        const courses = await courseService.getAllCourses();
        if (!courses || courses.length === 0) {
            throw new AppError('Course tidak ditemukan', httpStatus.NOT_FOUND, 'course');
        }
        
        return successResponse(res, httpStatus.OK, 'Berhasil mengambil data course', courses);
    } catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mengambil data course",
                [{ field: error.field, message: error.message }]
            );
        }

        return errorResponse(res)
    }
};

const getCourseById = async (req, res) => {
    try {
        const course_id = parseInt(req.params.courseId);
        const course = await courseService.getCourseById(course_id);

        if (!course) {
            throw new AppError('Course tidak ditemukan', httpStatus.NOT_FOUND, 'course');
        }

        return successResponse(res, httpStatus.OK, 'Berhasil mengambil data course', course);
    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mengambil data course",
                [{ field: error.field, message: error.message }]
            );
        }

        return errorResponse(res);
    }
};

const getCourseBySlug = async (req, res) => {
    try {;
        const course_slug = req.params.courseSlug;
        const course = await courseService.getCourseBySlug(course_slug);

        if (!course) {
            throw new AppError('Course tidak ditemukan', httpStatus.NOT_FOUND, 'course');
        }

        return successResponse(res, httpStatus.OK, 'Berhasil mengambil data course', course);
    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mengambil data course",
                [{ field: error.field, message: error.message }]
            );
        }

        return errorResponse(res);
    }
};

const enrollCourse = async (req, res) => {
    try {
        const user_id = req.user.id;
        const course_id = parseInt(req.params.courseId);

        if (!course_id || !user_id) {
            const errors = [];

            if (!course_id) {
                errors.push({ field: 'course_id', message: 'Course ID tidak boleh kosong'});
            }

            if (!user_id) {
                errors.push({ field: 'user_id', message: 'User ID tidak boleh kosong'});
            }

            throw new AppError('Gagal mendaftar di course', httpStatus.BAD_REQUEST, null, errors);
        }

        const course = await courseService.getCourseById(course_id);
        if (!course) {
            throw new AppError('Course tidak ditemukan', httpStatus.NOT_FOUND, 'course');
        }

        const enrolled = await courseService.checkEnrollmentStatus(user_id, course_id);
        if (enrolled) {
            throw new AppError('Anda sudah terdaftar di course ini', httpStatus.BAD_REQUEST, 'enrollment');
        }

        await courseService.enrollCourse(user_id, course_id);

        return successResponse(res, httpStatus.CREATED, 'Berhasil mendaftar di course');
    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mendaftar di course",
                [{ field: error.field, message: error.message }]
            );
        }

        return errorResponse(res);
    }
}

const getEnrolledCourses = async (req, res) => {
    try {
        const user_id = req.user.id;
        if (!user_id) {
            throw new AppError('User ID tidak boleh kosong', httpStatus.BAD_REQUEST, 'user');
        }

        const courses = await courseService.getEnrolledCourses(user_id);
        if (courses.length === 0) {
            throw new AppError('User belum terdaftar pada course manapun', httpStatus.NOT_FOUND, 'course');
        }

        return successResponse(res, httpStatus.OK, 'Berhasil mengambil data course yang diikuti', courses);
    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mengambil data course yang diikuti",
                [{ field: error.field, message: error.message }]
            );
        }

        return errorResponse(res);
    }
};

const checkEnrollmentStatus = async (req, res) => {
    try {
        const user_id = req.user.id;
        const course_id = parseInt(req.params.courseId);

        if (!course_id || !user_id) {
            const errors = [];

            if (!course_id) {
                errors.push({ field: 'course_id', message: 'Course ID tidak boleh kosong'});
            }

            if (!user_id) {
                errors.push({ field: 'user_id', message: 'User ID tidak boleh kosong'});
            }

            throw new AppError('Gagal mengecek status enrollment', httpStatus.BAD_REQUEST, null, errors);
        }

        const course = await courseService.getCourseById(course_id);
        if (!course) {
            throw new AppError('Course tidak ditemukan', httpStatus.NOT_FOUND, 'course');
        }

        const enrolled = await courseService.checkEnrollmentStatus(user_id, course_id);

        return successResponse(res, httpStatus.OK, 'Berhasil mengecek status enrollment', { course, enrolled });
    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(
                res,
                error.statusCode,
                "Gagal mengecek status enrollment",
                [{ field: error.field, message: error.message }]
            );
        }

        return errorResponse(res);
    }
}

export default {
    getAllCourses,
    getCourseById,
    getCourseBySlug,
    enrollCourse,
    getEnrolledCourses,
    checkEnrollmentStatus
};