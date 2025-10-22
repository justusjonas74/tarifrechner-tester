/** @type {import('next').NextConfig} */

require("dotenv").config();
const { join } = require("path");

const nextConfig = {
  output: "standalone",
  allowedDevOrigins: [process.env.NEXT_PUBLIC_URL, "efm.lan.vvo"],
  outputFileTracingRoot: join(__dirname, "../"),
  async rewrites() {
    return [
      {
        source: "/tarifrechner",
        // source: "/tarifrechner/:path*",
        // destination: process.env.NEXT_PUBLIC_URL + ":path*",
        destination: process.env.NEXT_PUBLIC_URL,
      },
    ];
  },
};

module.exports = nextConfig;
