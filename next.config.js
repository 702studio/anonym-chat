/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: '/anonym_chat', // Alt klasörde çalışması için yol tanımlaması
  // Basit ama etkili yapılandırma
  webpack: (config, { isServer, dev }) => {
    // Fast Refresh ve Hot Reloading için webpack yapılandırması
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 500,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    return config;
  },
  // Hot reload performansını artır
  onDemandEntries: {
    // Sayfaların bellekte ne kadar süre tutulacağı
    maxInactiveAge: 25 * 1000,
    // Aynı anda bellekte tutulacak maksimum sayfa sayısı
    pagesBufferLength: 5,
  },
}

module.exports = nextConfig 