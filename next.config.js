/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false
  },
  images: {
    domains: ["GPires.Portifolio.com", "images.unsplash.com"]
  }
};

module.exports = nextConfig;
