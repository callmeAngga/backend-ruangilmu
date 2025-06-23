import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../utils/appError.js';
import httpStatus from '../constants/httpStatus.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', 'uploads', 'courses');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Nama file sementara simple saja, nanti diubah di adminService
        const timestamp = Date.now();
        const fileExtension = path.extname(file.originalname);
        
        // Format simple: fieldname-timestamp.ext
        const fileName = file.fieldname + '-' + timestamp + fileExtension;
        
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new AppError('Hanya file gambar (JPEG, JPG, PNG, GIF) yang diizinkan!', httpStatus.UNSUPPORTED_MEDIA_TYPE, 'file'));
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
}).fields([
    { name: 'course_image_profile', maxCount: 1 },
    { name: 'course_image_cover', maxCount: 1 }
]);

export const uploadCourseImages = (req, res, next) => {
    console.log('Uploading course images...');
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new AppError('Ukuran file terlalu besar. Maksimal 5MB.', httpStatus.PAYLOAD_TOO_LARGE, 'file'));
            }
            return next(new AppError(err.message, httpStatus.BAD_REQUEST, 'file_upload_error'));
        } else if (err) {
            return next(err);
        }
        next();
    });
};

export const deleteFileIfExists = (fileName) => {
    const filePath = path.join(uploadDir, fileName);
    if (fileName && fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log(`File deleted successfully: ${filePath}`);
        } catch (error) {
            console.error(`Error deleting file ${filePath}:`, error);
        }
    }
};

// Export uploadDir untuk service
export { uploadDir };