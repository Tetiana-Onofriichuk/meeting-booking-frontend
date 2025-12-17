// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Можна лишити ТІЛЬКИ те, що справді потрібно
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ac.goit.global",
        pathname: "/**", // ← обовʼязково, інакше SSR може падати
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    // або альтернативно: domains: ['ac.goit.global', 'res.cloudinary.com']
  },
};

export default nextConfig;
