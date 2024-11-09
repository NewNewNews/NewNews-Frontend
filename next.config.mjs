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
  // async rewrites() {
  //   return [
  //     beforeFiles: [
  //       // Handle API gateway routes
  //       {
  //         source: "/api/:path*",
  //         destination:
  //           process.env.API_GATEWAY_URL || "http://gateway:8080/api/:path*",
  //       },
  //     ],
  //     afterFilesFiles: [
  //       // Handle Next.js Auth routes first
  //       {
  //         source: "/api/auth/:path*",
  //         destination: "http://nextjs:3000/api/auth/:path*",
  //       },
  //     ],
  //   ];
  // },
  async rewrites() {
    return [
      // {
      //   source: "/api/auth/:path*",
      //   destination: "http://localhost:3000/api/auth/:path*",
      // },
      {
        source: "/api/:path*",
        destination:
          process.env.API_GATEWAY_URL || "http://gateway:8080/api/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }, // Adjust for your domain
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, PATCH",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, X-Api-Version",
          },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
    ];
  },
};

export default nextConfig;
