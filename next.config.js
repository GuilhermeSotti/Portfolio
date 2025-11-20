/** next.config.js */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com", "images.unsplash.com"]
  },
  // se no futuro quiser appDir (App Router), habilite conforme docs oficiais
  // appDir: true, // apenas se você migrou para App Router e quer usar app/
};

module.exports = nextConfig;
