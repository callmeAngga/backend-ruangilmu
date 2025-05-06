const httpStatus = require('../constants/httpStatus');
const reviewService = require('../services/reviewService');
const reviewValidator = require('../validators/reviewValidator');

exports.createReview = async (req, res) => {
    try {
        // Validasi input
        const { error } = reviewValidator.validateCreateReview(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        const { course_id, content } = req.body;
        const user_id = req.user.id;

        const review = await reviewService.createReview(user_id, course_id, content);
        
        // Analisa sentiment setelah review dibuat
        await reviewService.analyzeSentiment(review.review_id);
        
        // Ambil review yang sudah termasuk sentiment
        const updatedReview = await reviewService.getReviewById(review.review_id);

        res.status(httpStatus.CREATED).json({
            status: 'success',
            message: 'Review berhasil dibuat',
            data: updatedReview
        });
    } catch (error) {
        console.error(error.message);
        
        if (error.message.includes('terdaftar') || error.message.includes('sudah memberikan review')) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: error.message
            });
        }

        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal membuat review'
        });
    }
};

exports.getReviewsByCourse = async (req, res) => {
    try {
        const course_id = parseInt(req.params.courseId);
        const reviews = await reviewService.getReviewsByCourseId(course_id);

        res.status(httpStatus.OK).json({
            status: 'success',
            data: reviews
        });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengambil review course'
        });
    }
};

exports.getUserReviewForCourse = async (req, res) => {
    try {
        const user_id = req.user.id;
        const course_id = parseInt(req.params.courseId);
        
        const review = await reviewService.getUserReviewForCourse(user_id, course_id);
        
        if (!review) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: 'error',
                message: 'Review tidak ditemukan'
            });
        }

        res.status(httpStatus.OK).json({
            status: 'success',
            data: review
        });
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal mengambil review'
        });
    }
};

exports.updateReview = async (req, res) => {
    try {
        // Validasi input
        const { error } = reviewValidator.validateUpdateReview(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        const review_id = parseInt(req.params.id);
        const user_id = req.user.id;
        const { content } = req.body;

        const updatedReview = await reviewService.updateReview(review_id, user_id, content);
        
        // Analisa ulang sentiment setelah review diupdate
        await reviewService.analyzeSentiment(review_id);
        
        // Ambil review yang sudah termasuk sentiment terbaru
        const finalReview = await reviewService.getReviewById(review_id);

        res.status(httpStatus.OK).json({
            status: 'success',
            message: 'Review berhasil diperbarui',
            data: finalReview
        });
    } catch (error) {
        console.error(error.message);
        
        if (error.message === 'Review tidak ditemukan' || error.message.includes('tidak memiliki izin')) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'error',
                message: error.message
            });
        }

        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal memperbarui review'
        });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review_id = parseInt(req.params.id);
        const user_id = req.user.id;

        await reviewService.deleteReview(review_id, user_id);

        res.status(httpStatus.OK).json({
            status: 'success',
            message: 'Review berhasil dihapus'
        });
    } catch (error) {
        console.error(error.message);
        
        if (error.message === 'Review tidak ditemukan' || error.message.includes('tidak memiliki izin')) {
            return res.status(httpStatus.FORBIDDEN).json({
                status: 'error',
                message: error.message
            });
        }

        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Gagal menghapus review'
        });
    }
};