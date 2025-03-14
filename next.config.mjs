/** @type {import('next').NextConfig} */
const nextConfig = {
  // We need server-side rendering for auth features
  distDir: '.next',
  images: {
    domains: ['placehold.co', 'placeholder.com', 'picsum.photos', 'images.unsplash.com'],
    unoptimized: true, // Required for static export
  },
  // This helps with proper Netlify routing
  trailingSlash: true,
  // Remove empty experimental object
  experimental: {
  },
  // Use static export for simplified Netlify deployment
  output: 'export',
};

export default nextConfig;
