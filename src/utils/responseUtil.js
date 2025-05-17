const httpStatus = require('../constants/httpStatus');

// Template untuk response sukses
exports.successResponse = (res, code, message, data) => {
  return res.status(code).json({
    status: 'success',
    code,
    message,
    data
  });
};

// Template untuk response gagal (validasi, bad request)
exports.failResponse = (res, code, message, errors) => {
  return res.status(code).json({
    status: 'fail',
    code,
    message,
    errors
  });
};

// Template untuk response error (server error)
exports.errorResponse = (res, code = httpStatus.INTERNAL_SERVER_ERROR , message = 'Terjadi kesalahan pada server', errors = []) => {
  return res.status(code).json({
    status: 'error',
    code,
    message,
    errors: errors.length ? errors : [
      {
        field: 'server',
        message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti'
      }
    ]
  });
};