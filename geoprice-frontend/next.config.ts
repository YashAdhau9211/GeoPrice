import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * 
 * Code Splitting Strategy:
 * - Next.js 16 automatically splits code by pages and routes
 * - Each page in the app directory becomes its own chunk
 * - Shared components are automatically extracted into common chunks
 * - Dynamic imports can be used for heavy components if needed
 * - Run `npm run analyze` to inspect bundle sizes
 */
const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // For S3-hosted images
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com', // For Cloudinary-hosted images
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // For Unsplash images
      },
      {
        protocol: 'http',
        hostname: 'localhost', // For local development
      },
    ],
    // Define device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Define image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Image formats to use (modern formats for better compression)
    formats: ['image/webp'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
};

export default nextConfig;
