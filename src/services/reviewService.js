const Review = require('../models/reviewModel');
const Course = require('../models/courseModel');
const AppError = require('../utils/appError');
const httpStatus = require('../constants/httpStatus');
const getGradioClient = require('../utils/gradioClient');

const createReview = async (user_id, course_id, content) => {
    const isEnrolled = await Course.checkUserEnrollment(user_id, course_id);
    if (!isEnrolled) {
        throw new AppError('Anda harus terdaftar dalam course ini untuk memberikan review', httpStatus.FORBIDDEN, 'enrollment');
    }

    const hasReviewed = await Review.checkUserReviewExists(user_id, course_id);
    if (hasReviewed) {
        throw new AppError('Anda sudah memberikan review untuk course ini', httpStatus.BAD_REQUEST, 'review');
    }

    const review = await Review.createReview(user_id, course_id, content);
    return review;
};

const getReviewById = async (review_id) => {
    const review = await Review.getReviewById(review_id);
    if (!review) {
        throw new AppError('Review tidak ditemukan', httpStatus.NOT_FOUND, 'review');
    }
    return review;
};

const getReviewsByUserId = async (user_id) => {
    return await Review.getReviewsByUserId(user_id);
};

const getReviewsByCourseId = async (course_id) => {
    return await Review.getReviewsByCourseId(course_id);
};

const updateReview = async (review_id, user_id, content) => {
    const review = await Review.getReviewById(review_id);
    if (!review) {
        throw new AppError('Review tidak ditemukan', httpStatus.NOT_FOUND, 'review');
    }

    if (review.user_id !== user_id) {
        throw new AppError('Anda tidak memiliki izin untuk mengedit review ini', httpStatus.FORBIDDEN, 'permission');
    }

    const updatedReview = await Review.updateReview(review_id, content);
    return updatedReview;
};

const deleteReview = async (review_id, user_id) => {
    const review = await Review.getReviewById(review_id);
    if (!review) {
        throw new AppError('Review tidak ditemukan', httpStatus.NOT_FOUND, 'review');
    }

    if (review.user_id !== user_id) {
        throw new AppError('Anda tidak memiliki izin untuk menghapus review ini', httpStatus.FORBIDDEN, 'permission');
    }

    await Review.deleteReview(review_id);
    return true;
};

const getUserReviewForCourse = async (user_id, course_id) => {
    return await Review.getUserReviewForCourse(user_id, course_id);
};

const analyzeSentiment = async (review_id) => {
    // Fungsi ini akan diimplementasikan nanti untuk integrasi dengan model AI
    // Placeholder untuk saat ini

    const review = await Review.getReviewById(review_id);
    if (!review) {
        throw new AppError('Review tidak ditemukan', httpStatus.NOT_FOUND, 'review');
    }

    const client = await getGradioClient("wongfromindo/sentiment-ruangilmu-api");
    const sentiment = await client.predict('/predict', {
        text: review.content.toLowerCase(),
    });

    await Review.updateSentiment(review_id, sentiment.data[0]);

    return sentiment;
};

module.exports = {
    createReview,
    getReviewById,
    getReviewsByUserId,
    getReviewsByCourseId,
    updateReview,
    deleteReview,
    getUserReviewForCourse,
    analyzeSentiment
};