/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'user-gen-media-assets.s3.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
}

module.exports = nextConfig
