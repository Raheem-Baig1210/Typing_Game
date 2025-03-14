/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimize images
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Enable PWA features
  experimental: {
    // App Router is now stable in Next.js 14, so this flag is no longer needed
  },
  
  // Environment variables that will be available at build time
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
  },
  
  // Customize webpack config if needed
  webpack: (config, { isServer }) => {
    // Add any custom webpack configurations here
    return config;
  },
}

module.exports = nextConfig 