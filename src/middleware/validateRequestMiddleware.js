import { ZodError } from 'zod';
import { failResponse, errorResponse } from '../utils/responseUtil.js';

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

export default validateRequest;
