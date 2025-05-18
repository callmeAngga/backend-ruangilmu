const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/appError');
const httpStatus = require('../constants/httpStatus');

const uploadDir = path.join(__dirname, '../uploads/userprofile');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Nama file: username-userId.extension
        const userId = req.user.id;
        const email = req.user.email;
        const username = email.split('@')[0];
        const fileExt = path.extname(file.originalname);

        const filename = `${username}-${userId}${fileExt}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new AppError('Hanya file gambar (jpg, jpeg, png) yang diperbolehkan', httpStatus.BAD_REQUEST, 'profile_picture'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = {
    uploadProfilePicture: upload.single('profile_picture')
};