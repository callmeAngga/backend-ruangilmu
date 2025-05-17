const httpStatus = require('../constants/httpStatus');
const reviewService = require('../services/reviewService');
const reviewValidator = require('../validators/reviewValidator');
const AppError  = require('../utils/appError');
const { successResponse, failResponse, errorResponse } = require('../utils/responseUtil');

exports.createReview = async (req, res) => {
    try {
        const { course_id, content } = req.body;
        const user_id = req.user.id;

        const review = await reviewService.createReview(user_id, course_id, content);
        
        // Analisa sentiment setelah review dibuat
        await reviewService.analyzeSentiment(review.review_id);
        
        // Ambil review yang sudah termasuk sentiment
        const updatedReview = await reviewService.getReviewById(review.review_id);

        return successResponse(res, httpStatus.CREATED, 'Review berhasil dibuat', updatedReview);
    } catch (error) {
        console.error(error.message);
        
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, "Gagal membuat review", [
                {
                    field: error.field,
                    message: error.message,
                }
            ]);
        }

        return errorResponse(res);
    }
};

exports.getReviewsByCourse = async (req, res) => {
    try {
        const course_id = parseInt(req.params.courseId);
        if (!course_id) {
            throw new AppError('Course ID tidak ditemukan', httpStatus.BAD_REQUEST, 'course');
        }

        const reviews = await reviewService.getReviewsByCourseId(course_id);
        if (!reviews || reviews.length === 0) {
            throw new AppError('Tidak ada review untuk course ini', httpStatus.NOT_FOUND, 'review');
        }

        return successResponse(res, httpStatus.OK, 'Berhasil mengambil review course', reviews);
    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, "Gagal mengambil review", [
                {
                    field: error.field,
                    message: error.message,
                }
            ]);
        }

        return errorResponse(res);
    }
};

exports.getUserReviewForCourse = async (req, res) => {
    try {
        const user_id = req.user.id;
        const course_id = parseInt(req.params.courseId);
        
        const review = await reviewService.getUserReviewForCourse(user_id, course_id);
        if (!review) {
            throw new AppError('Review tidak ditemukan', httpStatus.NOT_FOUND, 'review');
        }

        return successResponse(res, httpStatus.OK, 'Berhasil mengambil review', review);
    } catch (error) {
        console.error(error.message);

        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, "Gagal mengambil review", [
                {
                    field: error.field,
                    message: error.message,
                }
            ]);
        }

        return errorResponse(res);
    }
};

exports.updateReview = async (req, res) => {
    try {
        const review_id = parseInt(req.params.id);
        const user_id = req.user.id;
        const { content } = req.body;

        const updatedReview = await reviewService.updateReview(review_id, user_id, content);
        
        // Analisa ulang sentiment setelah review diupdate
        await reviewService.analyzeSentiment(updatedReview.review_id);
        
        // Ambil review yang sudah termasuk sentiment terbaru
        const finalReview = await reviewService.getReviewById(updatedReview.review_id);

        return successResponse(res, httpStatus.OK, 'Review berhasil diperbarui', finalReview);
    } catch (error) {
        console.error(error.message);
        
        if ( error instanceof AppError) {
            return failResponse(res, error.statusCode, "Gagal memperbarui review", [
                {
                    field: error.field,
                    message: error.message,
                }
            ]);
        }

        return errorResponse(res);
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review_id = parseInt(req.params.id);
        const user_id = req.user.id;

        if (!review_id || !user_id) {
            const errors = [];
            if (!review_id) {
                errors.push({
                    field: 'review_id',
                    message: 'Review ID tidak ditemukan'
                });
            }
            if (!user_id) {
                errors.push({
                    field: 'user_id',
                    message: 'User ID tidak ditemukan'
                });
            }
            throw new AppError('Gagal menghapus review', httpStatus.BAD_REQUEST, null, errors);
        }

        await reviewService.deleteReview(review_id, user_id);

        return successResponse(res, httpStatus.OK, 'Review berhasil dihapus');
    } catch (error) {
        console.error(error.message);
        
        if (error instanceof AppError) {
            return failResponse(res, error.statusCode, "Gagal menghapus review", [
                {
                    field: error.field,
                    message: error.message,
                }
            ]);
        }

        return errorResponse(res);
    }
};