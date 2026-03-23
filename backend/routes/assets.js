const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME || 'ezdd-cloud',
    api_key: process.env.CLOUDINARY_API_KEY || '123456',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'secret'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ez-dd-assets',
        allowed_formats: ['jpg', 'png', 'svg', 'webp'],
    },
});

const upload = multer({ storage: storage });

// POST /assets/upload
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Missing image" });
        
        res.json({
            url: req.file.path,
            publicId: req.file.filename,
            message: "Asset uploaded to Cloudinary"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
