// Cloudinary configuration utility
import { v2 as cloudinary } from 'cloudinary';

// Initialize the Cloudinary configuration with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to update URLs with the correct cloud name
export function updateCloudinaryUrl(url) {
  // Replace the placeholder with the actual cloud name
  return url.replace('YOUR_CLOUD_NAME', process.env.CLOUDINARY_CLOUD_NAME || '');
}

export default cloudinary; 