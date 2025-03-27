/** @type {import('next').NextConfig} */

require("dotenv").config();
const { join } = require("path");

console.log(join(__dirname, "../tarifrechner-sst"));
const nextConfig = {
  output: "standalone",
  allowedDevOrigins: [process.env.NEXT_PUBLIC_URL, "efm.lan.vvo"],
  outputFileTracingRoot: join(__dirname, "../"),
  async rewrites() {
    return [
      {
        source: "/tarifrechner/:path*",
        destination: process.env.NEXT_PUBLIC_URL + ":path*",
      },
    ];
  },
};

module.exports = nextConfig;
