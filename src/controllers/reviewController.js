const httpStatus = require('../constants/httpStatus');


exports.createReview = async (req, res) => {
    try {
        const user_id = req.user.id;
        const course_id = parseInt(req.params.id);
        const { komentar } = req.body;

        try {
            if (!komentar) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Komentar harus diisi'
                });
            }

            const review = await reviewService.createReview(user_id, course_id, komentar);

            res.status(httpStatus.CREATED).json({
                status: 'success',
                data: review
            }); 
        } catch (error) {
            console.error(error.message);
            return res.status(httpStatus.BAD_REQUEST).json({
                status: 'error',
                message: error.message
            });
        }
    } catch (error) {
        console.error(error.message);
        res.status(httpStatus.BAD_REQUEST).json({
            status: 'error',
            message: error.message,
            error_code: error.code
        });
    }
};