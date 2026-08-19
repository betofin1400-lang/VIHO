import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "https://*.trycloudflare.com",
    "http://localhost:3000",
  ],
};

export default nextConfig;
