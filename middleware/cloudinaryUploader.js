// middleware/cloudinaryUploader.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products', // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

// this means that all images will be stored in storage (cloudinary)
const upload = multer({ storage });

export default upload;
