const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'OnlineLearningPlatform_Videos', // your folder name in Cloudinary
    resource_type: 'video', // allow videos, not just images
    allowedFormats: ['mp4', 'mov', 'avi', 'mkv']
  }
});

module.exports = { cloudinary, storage };
