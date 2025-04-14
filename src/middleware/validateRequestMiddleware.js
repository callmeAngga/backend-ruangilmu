const { ZodError } = require('zod');

const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ errors: error.errors.map(err => err.message) });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = validateRequest;
