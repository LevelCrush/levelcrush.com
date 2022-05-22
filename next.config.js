/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  reactStrictMode: true,
  images: {
    domains: ['assets.levelcrush.com']
  },
  optimizeFonts: false,
});

module.exports = withBundleAnalyzer;
