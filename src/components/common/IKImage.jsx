import React from 'react';
import { cloudinaryToImageKit, applyTransformations } from '@/utils/imagekit';

/**
 * ImageKit Image component that handles both Cloudinary and ImageKit URLs
 */
export default function IKImage({
  src,
  alt = '',
  className = '',
  width,
  height,
  transformations = {},
  fallback = '',
  ...props
}) {
  // Convert Cloudinary URL to ImageKit URL if needed
  const imagekitSrc = cloudinaryToImageKit(src);
  
  // Apply ImageKit transformations if needed
  const finalSrc = transformations && Object.keys(transformations).length > 0
    ? applyTransformations(imagekitSrc, transformations)
    : imagekitSrc;
  
  // Handle image loading error
  const handleError = (e) => {
    if (fallback) {
      e.target.src = fallback;
    }
  };

  // Set width and height attributes if provided
  const sizeProps = {};
  if (width) sizeProps.width = width;
  if (height) sizeProps.height = height;

  return (
    <img
      src={finalSrc || fallback}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...sizeProps}
      {...props}
    />
  );
} 