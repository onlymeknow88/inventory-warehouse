/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**.tokopedia.com',
      },
      {
        protocol: 'https',
        hostname: '**.shopee.co.id',
      },
      {
        protocol: 'https',
        hostname: '**.bukalapak.com',
      },
    ],
  },
};

export default nextConfig;
