/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-image-domain.com'], // Add your image domains here
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig 