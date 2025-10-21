import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ✅ дозволяє всі HTTPS-домени
      },
      {
        protocol: 'http',
        hostname: '**', // (опціонально) для HTTP
      }
    ],
  },
};

export default nextConfig;
