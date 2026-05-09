import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tbnvfelretxmprlxzavu.supabase.co",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.1.39"],
};

export default nextConfig;
