/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,
  experimental: {
    runtime: "edge",
    
 },
  
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
