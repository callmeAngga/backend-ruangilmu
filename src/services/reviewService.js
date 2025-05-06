const Review = require('../models/reviewModel');
const Course = require('../models/courseModel');

const createReview = async (user_id, course_id, content) => {
    // Verifikasi bahwa user sudah enroll ke course
    const isEnrolled = await Course.checkUserEnrollment(user_id, course_id);
    if (!isEnrolled) {
        throw new Error('Anda harus terdaftar dalam course ini untuk memberikan review');
    }

    // Cek apakah user sudah memberikan review sebelumnya
    const hasReviewed = await Review.checkUserReviewExists(user_id, course_id);
    if (hasReviewed) {
        throw new Error('Anda sudah memberikan review untuk course ini');
    }

    // Buat review baru
    const review = await Review.createReview(user_id, course_id, content);
    
    // Di sini nanti akan diintegrasikan dengan model AI untuk analisis sentiment
    // Akan diimplementasikan pada tahap berikutnya

    return review;
};

const getReviewById = async (review_id) => {
    const review = await Review.getReviewById(review_id);
    if (!review) {
        throw new Error('Review tidak ditemukan');
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
    // Verifikasi bahwa review ada dan milik user tersebut
    const review = await Review.getReviewById(review_id);
    if (!review) {
        throw new Error('Review tidak ditemukan');
    }
    
    if (review.user_id !== user_id) {
        throw new Error('Anda tidak memiliki izin untuk mengedit review ini');
    }

    // Update review
    const updatedReview = await Review.updateReview(review_id, content);
    
    // Reset sentiment saat review diupdate
    // Analisis sentiment akan dilakukan lagi nanti

    return updatedReview;
};

const deleteReview = async (review_id, user_id) => {
    // Verifikasi bahwa review ada dan milik user tersebut
    const review = await Review.getReviewById(review_id);
    if (!review) {
        throw new Error('Review tidak ditemukan');
    }
    
    if (review.user_id !== user_id) {
        throw new Error('Anda tidak memiliki izin untuk menghapus review ini');
    }

    // Hapus review
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
        throw new Error('Review tidak ditemukan');
    }

    // Contoh sederhana untuk analisis sentiment, kedepannya akan diganti dengan model AI
    let sentiment = 'netral';
    const text = review.content.toLowerCase();
    
    const positiveWords = ['bagus', 'baik', 'suka', 'hebat', 'keren', 'mantap', 'memuaskan'];
    const negativeWords = ['buruk', 'jelek', 'tidak suka', 'kecewa', 'kurang', 'sulit'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
        if (text.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
        if (text.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) sentiment = 'positif';
    else if (negativeCount > positiveCount) sentiment = 'negatif';
    
    // Update sentiment pada review
    await Review.updateSentiment(review_id, sentiment);
    
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