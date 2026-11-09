/** @type {import('next').NextConfig} */

const { join } = require("path");

const nextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    ...(process.env.NEXT_PUBLIC_URL ? [process.env.NEXT_PUBLIC_URL] : []),
    "efm.lan.vvo",
  ],
  outputFileTracingRoot: join(__dirname, "../"),
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

module.exports = nextConfig;
