const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const models = require("../models");
const he = require('he');
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'threads/uploads',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'fill' }],
    }
});

const upload = multer({ storage });

let cloudinaryController = {};

cloudinaryController.updateProfile = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    const userId = req.user.id;
    await upload.single('avatar')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: 'File upload failed', error: err });
        }

        try {
            const description = he.encode(req.body.description);
            const website = he.encode(req.body.website);
            const fullName = he.encode(req.body.fullName);
            const username = he.encode(req.body.username);
            let avatarUrl = req.body.avatarUrl;
            const existingUser = await models.User.findOne({ where: { id: userId } });

            if (req.file) {
                try {
                    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                        folder: 'threads',
                        transformation: [{ width: 500, height: 500, crop: 'fill' }],
                    });
                    avatarUrl = uploadedImage.secure_url;
                } catch (error) {
                    console.error(error);
                    return res.status(400).json({ success: false, message: 'Failed to upload image' });
                }
            }  else {
                avatarUrl = existingUser.avatarUrl;
            }

            // Check if the username is already taken
            const existingUsername = await models.User.findOne({ where: { username } });
            if (existingUsername && existingUsername.id !== userId) {
                return res.status(400).json({ success: false, message: 'Username already taken' });
            }

            const updatedUser = await models.User.update(
                {
                    description,
                    website,
                    avatarUrl,
                    fullName,
                    username,
                },
                {
                    where: { id: userId },
                }
            );

            if (updatedUser) {
                return res.json({ success: true, message: 'Profile updated successfully', avatarUrl, description, website, fullName, username });
            } else {
                return res.status(400).json({ success: false, message: 'Failed to update profile' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    });
};

module.exports = cloudinaryController;
