const httpStatus = require('../constants/httpStatus');
const courseService = require('../services/courseService');
const AppError = require('../utils/appError');
const { errorResponse, failResponse } = require('../utils/responseUtil');

const checkEnrollment = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        if (!user_id) {
            throw new AppError('User tidak terautentikasi, silakan login terlebih dahulu', httpStatus.UNAUTHORIZED, 'user');
        }

        const course_id = parseInt(req.params.courseId);
        if (!course_id) {
            throw new AppError('Course ID tidak ditemukan', httpStatus.BAD_REQUEST, 'course');
        }

        const course = await courseService.getCourseById(course_id);
        if (!course) {
            throw new AppError(`Tidak ditemukan course dengan id ${course_id}`, httpStatus.NOT_FOUND, 'course');
        }

        const isEnrolled = await courseService.checkEnrollmentStatus(user_id, course_id);
        if (!isEnrolled) {
            throw new AppError('Anda tidak punya izin akses, pastikan anda sudah enroll ke course ini', httpStatus.FORBIDDEN, 'enrollment');
        }

        next();
    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, "Proses gagal", [
                {
                    field: error.field,
                    message: error.message
                }
            ]
            );
        }
        return errorResponse(res)
    }
};

module.exports = checkEnrollment
