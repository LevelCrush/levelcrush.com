/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.levelcrush.com']
  },
  optimizeFonts: false,
  redirects: async () => {
    return [
      {
        
        source: '/guides',
        destination: '/guides/destiny2/votd',
        permanent: false,
      }
    ]
  }
}

module.exports = nextConfig
