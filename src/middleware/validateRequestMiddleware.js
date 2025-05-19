const { ZodError } = require('zod');
const { failResponse, errorResponse } = require('../utils/responseUtil');

const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedErrors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            
            return failResponse(res, 400, 'Validation Error', formattedErrors);
        }
        return errorResponse(res);
    }
};

module.exports = validateRequest;
