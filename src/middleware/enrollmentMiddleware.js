const httpStatus = require('../constants/httpStatus');
const courseService = require('../services/courseService');

// Middleware untuk memastikan user sudah enroll di course sebelum memberikan review
const checkEnrollment = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: 'error',
                message: 'Anda harus login terlebih dahulu'
            });
        }

        const user_id = req.user.id;
        const course_id = parseInt(req.body.course_id) || parseInt(req.params.courseId);
        
        if (!course_id) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: 'Course ID tidak valid'
            });
        }

        const course = await courseService.getCourseById(course_id);
        if (!course) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'error',
                message: 'Course tidak ditemukan'
            });
        }
        
        // Periksa apakah user sudah enroll
        const isEnrolled = await courseService.checkEnrollmentStatus(user_id, course_id);
        
        if (!isEnrolled) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'error',
                message: 'Anda harus terdaftar dalam course ini untuk memberikan review'
            });
        }
        
        next();
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Terjadi kesalahan saat verifikasi enrollment'
        });
    }
};

module.exports = checkEnrollment
