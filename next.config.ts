import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         { protocol: "https", hostname: "lh3.googleusercontent.com" },
         { protocol: "https", hostname: "res.cloudinary.com" },
         { protocol: "https", hostname: "images.unsplash.com" },
         { protocol: "https", hostname: "sandbox.sslcommerz.com" }
      ]
   },
   devIndicators: false,
   experimental: {
      serverActions: {
         bodySizeLimit: "2mb"
      }
   }
};

export default nextConfig;
