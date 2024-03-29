/** @type {import('next').NextConfig} */

require('dotenv').config()

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/tarifrechner/:path*',
        destination: process.env.NEXT_PUBLIC_URL + ':path*',
      },
    ]
  },
}

module.exports = nextConfig