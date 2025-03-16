// Cloudinary configuration utility
import { v2 as cloudinary } from 'cloudinary';

// Initialize the Cloudinary configuration
// This will use the CLOUDINARY_URL environment variable by default
cloudinary.config();

// Helper function to update URLs with the correct cloud name
export function updateCloudinaryUrl(url) {
  // Replace the placeholder with the actual cloud name
  return url.replace('YOUR_CLOUD_NAME', 'dxow1rafl');
}

export default cloudinary; 