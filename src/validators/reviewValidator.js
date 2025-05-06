const zod = require('zod');

// Schema untuk validasi create review
const createReviewSchema = zod.object({
    course_id: zod.number({
        required_error: "Course ID harus diisi",
        invalid_type_error: "Course ID harus berupa angka"
    }).int().positive("Course ID harus bilangan bulat positif"),
    
    content: zod.string({
        required_error: "Konten review harus diisi",
        invalid_type_error: "Konten review harus berupa string"
    }).min(5, "Review minimal 5 karakter").max(1000, "Review maksimal 1000 karakter")
});

// Schema untuk validasi update review
const updateReviewSchema = zod.object({
    content: zod.string({
        required_error: "Konten review harus diisi",
        invalid_type_error: "Konten review harus berupa string"
    }).min(5, "Review minimal 5 karakter").max(1000, "Review maksimal 1000 karakter")
});

const validateCreateReview = (data) => {
    try {
        createReviewSchema.parse(data);
        return { error: null };
    } catch (error) {
        return {
            error: {
                details: [
                    {
                        message: error.errors[0].message
                    }
                ]
            }
        };
    }
};

const validateUpdateReview = (data) => {
    try {
        updateReviewSchema.parse(data);
        return { error: null };
    } catch (error) {
        return {
            error: {
                details: [
                    {
                        message: error.errors[0].message
                    }
                ]
            }
        };
    }
};

module.exports = {
    validateCreateReview,
    validateUpdateReview
};