// ImageKit configuration utility
import ImageKit from 'imagekit-javascript';

// Initialize ImageKit with public credentials
export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

/**
 * Converts a Cloudinary URL to an ImageKit URL
 * 
 * @param {string} url - The Cloudinary URL to convert
 * @returns {string} - The ImageKit URL
 */
export function cloudinaryToImageKit(url) {
  if (!url) return url;
  
  // Skip if it's already an ImageKit URL
  if (url.includes('ik.imagekit.io')) {
    return url;
  }
  
  // Handle Cloudinary URLs
  if (url.includes('res.cloudinary.com/dxow1rafl')) {
    // Extract the path after upload/
    const matches = url.match(/res\.cloudinary\.com\/dxow1rafl\/image\/upload\/(v\d+\/)?(.+)$/);
    
    if (matches && matches[2]) {
      const path = matches[2];
      return `https://ik.imagekit.io/cbzkrwprl/${path}`;
    }
  }
  
  // Return original URL if no conversion is possible
  return url;
}

/**
 * Applies ImageKit transformations to a URL
 * 
 * @param {string} url - The ImageKit URL
 * @param {Object} transformations - Transformations to apply
 * @returns {string} - URL with transformations
 */
export function applyTransformations(url, transformations = {}) {
  if (!url) return url;
  
  // Skip if not an ImageKit URL
  if (!url.includes('ik.imagekit.io')) {
    return url;
  }
  
  // Convert transformations object to query parameters
  const params = Object.entries(transformations)
    .map(([key, value]) => `${key}-${value}`)
    .join(',');
  
  if (!params) return url;
  
  // Insert transformations into URL
  const [urlBase, urlPath] = url.split('ik.imagekit.io/cbzkrwprl/');
  return `${urlBase}ik.imagekit.io/cbzkrwprl/tr:${params}/${urlPath}`;
}

export default imagekit; 