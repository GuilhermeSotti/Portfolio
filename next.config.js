/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false
  },
  images: {
    domains: ["avatars.githubusercontent.com", "images.unsplash.com"]
  }
};

module.exports = nextConfig;
