/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'experimental-edge',
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains : ['https://static-dev.infoimoveis.com.br'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-dev.infoimoveis.com.br',
      },
    ],
  },

}

module.exports = nextConfig
