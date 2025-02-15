/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      enabled: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
