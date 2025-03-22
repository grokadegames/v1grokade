// Server-side ImageKit utility
import ImageKit from 'imagekit';

// Initialize ImageKit with server-side credentials
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_yf4/s4sqsRi/BPBW6g3HD+k5TuI=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_bCEM9K7BDaU6Aes7yp0Xj0uMTqw=',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/cbzkrwprl',
});

/**
 * Upload a buffer to ImageKit
 * 
 * @param {Buffer} buffer - The file buffer to upload
 * @param {string} fileName - Name of the file
 * @param {Object} options - Upload options
 * @returns {Promise} - Upload result
 */
export async function uploadBuffer(buffer, fileName, options = {}) {
  const { folder = '', useUniqueFileName = true, tags = [], ...rest } = options;
  
  try {
    const result = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: useUniqueFileName,
      tags: tags,
      ...rest,
    });
    
    return result;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw error;
  }
}

/**
 * Get authentication parameters for client-side uploads
 * 
 * @returns {Object} - Authentication parameters
 */
export function getAuthParams() {
  return imagekit.getAuthenticationParameters();
}

export default imagekit; 