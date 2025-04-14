const httpStatus = require('../constants/httpStatus');
const courseService = require('../services/courseService');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await courseService.getAllCourses();
        res.status(httpStatus.OK).json({
            status: 'success',
            data: courses
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengambil data course'
        });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course_id = parseInt(req.params.id)
        console.log('Course ID:', course_id);
        const course = await courseService.getCourseById(course_id);

        let enrolled = false;
        if (req.user) {
            enrolled = await courseService.checkEnrollmentStatus(req.user.user_id, course_id);
        }

        res.status(httpStatus.OK).json({
            status: 'success',
            data: course
        });
    } catch (error) {
        console.error(error.message);
        if (error.message === 'Course tidak ditemukan') {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'error',
                message: error.message
            });
        }

        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengambil detail course'
        })
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const user_id = req.user.id;
        const courses = await courseService.getEnrolledCourses(user_id);
        res.status(httpStatus.OK).json({
            status: 'success',
            data: courses
        });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengambil data course yang diikuti'
        });
    }
};

exports.enrollCourse = async (req, res) => {
    try {
        const user_id = req.user.id;
        const course_id = parseInt(req.params.id);

        console.log('User ID:', user_id);
        console.log('Course ID:', course_id);

        const course = await courseService.getCourseById(course_id);
        if (!course) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'error',
                message: 'Course tidak ditemukan'
            });
        }

        console.log('Course:', course);

        const enrolled = await courseService.checkEnrollmentStatus(user_id, course_id);
        if (enrolled) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: 'Anda sudah terdaftar di course ini'
            });
        }

        console.log('Enrolled:', enrolled);

        await courseService.enrollCourse(user_id, course_id);

        console.log('Enrollment successful');

        res.status(httpStatus.OK).json({
            status: 'success',
            message: 'Berhasil mendaftar di course'
        });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mendaftar di course'
        });
    }
}