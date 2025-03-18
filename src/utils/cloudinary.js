// Cloudinary configuration utility
import { v2 as cloudinary } from 'cloudinary';

// Initialize the Cloudinary configuration with explicit values
cloudinary.config({
  cloud_name: 'dxow1rafl',
  api_key: '189369456186199',
  api_secret: '31EANFqVf28WcdN3p7IE2_q-wtw'
});

// Helper function to update URLs with the correct cloud name
export function updateCloudinaryUrl(url) {
  // Replace the placeholder with the actual cloud name
  return url.replace('YOUR_CLOUD_NAME', 'dxow1rafl');
}

export default cloudinary; 