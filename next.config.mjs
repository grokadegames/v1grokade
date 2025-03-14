/** @type {import('next').NextConfig} */
const nextConfig = {
  // We need server-side rendering for auth features
  distDir: '.next',
  images: {
    domains: ['placehold.co', 'placeholder.com', 'picsum.photos', 'images.unsplash.com'],
    unoptimized: true, // Required for Netlify deployment
  },
  // This helps with proper Netlify routing
  trailingSlash: true,
  // Use standalone output for Netlify
  output: 'standalone',
};

export default nextConfig;
