const multer = require('multer');
const { Readable } = require('stream');
const cloudinary = require('../../config/cloudinary');

// Multer: Lưu file tạm thời trong bộ nhớ
const upload = multer({ storage: multer.memoryStorage() });

// Hàm tải lên Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        Readable.from(fileBuffer).pipe(stream);
    });
};

module.exports = { upload, uploadToCloudinary };
