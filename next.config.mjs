/** @type {import('next').NextConfig} */
import path from "path";
const __dirname = new URL(".", import.meta.url).pathname;
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./src"),
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_GATEWAY_URL || "http://gateway:8080/api/:path*", // Docker internal URL
      },
    ];
  },
};

export default nextConfig;
