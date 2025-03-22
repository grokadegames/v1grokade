// Server-side ImageKit utility
import ImageKit from 'imagekit';

// Initialize ImageKit with server-side credentials
let imagekit;
try {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_yf4/s4sqsRi/BPBW6g3HD+k5TuI=',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_bCEM9K7BDaU6Aes7yp0Xj0uMTqw=',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/cbzkrwprl',
  });
  console.log('[ImageKit] Initialized with endpoint:', process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/cbzkrwprl');
} catch (initError) {
  console.error('[ImageKit] Initialization error:', initError);
  // Create a dummy imagekit object with methods that return errors
  imagekit = {
    upload: () => Promise.reject(new Error('ImageKit initialization failed')),
    getAuthenticationParameters: () => ({ error: 'ImageKit initialization failed' })
  };
}

/**
 * Upload a buffer to ImageKit
 * 
 * @param {Buffer} buffer - The file buffer to upload
 * @param {string} fileName - Name of the file
 * @param {Object} options - Upload options
 * @returns {Promise} - Upload result
 */
export async function uploadBuffer(buffer, fileName, options = {}) {
  if (!buffer || buffer.length === 0) {
    console.error('[ImageKit] Empty buffer provided');
    throw new Error('Empty buffer provided for upload');
  }
  
  if (!fileName) {
    console.error('[ImageKit] No fileName provided');
    throw new Error('No fileName provided for upload');
  }
  
  const { folder = '', useUniqueFileName = true, tags = [], ...rest } = options;
  
  try {
    console.log('[ImageKit] Starting upload for file:', fileName);
    console.log('[ImageKit] Buffer size:', buffer.length);
    
    // Convert buffer to base64 string
    let base64Image;
    try {
      base64Image = buffer.toString('base64');
      console.log('[ImageKit] Converted to base64, length:', base64Image.length);
    } catch (conversionError) {
      console.error('[ImageKit] Base64 conversion error:', conversionError);
      throw new Error(`Failed to convert image to base64: ${conversionError.message}`);
    }
    
    // Upload to ImageKit
    console.log('[ImageKit] Sending upload request to ImageKit...');
    const result = await imagekit.upload({
      file: base64Image,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: useUniqueFileName,
      tags: tags,
      ...rest,
    });
    
    if (!result || !result.url) {
      console.error('[ImageKit] Upload completed but no URL returned');
      throw new Error('Upload completed but no URL was returned from ImageKit');
    }
    
    console.log('[ImageKit] Upload successful, URL:', result.url);
    return result;
  } catch (error) {
    console.error('[ImageKit] Upload error:', error.message);
    if (error.response) {
      console.error('[ImageKit] Error response:', error.response.data);
    }
    
    // Enhance the error with more details
    const enhancedError = new Error(`ImageKit upload failed for ${fileName}: ${error.message}`);
    enhancedError.originalError = error;
    throw enhancedError;
  }
}

/**
 * Get authentication parameters for client-side uploads
 * 
 * @returns {Object} - Authentication parameters
 */
export function getAuthParams() {
  try {
    return imagekit.getAuthenticationParameters();
  } catch (error) {
    console.error('[ImageKit] Error getting auth parameters:', error);
    throw new Error(`Failed to get ImageKit authentication parameters: ${error.message}`);
  }
}

export default imagekit; 