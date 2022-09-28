/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["assets.levelcrush.com", "http.cat"],
  },
  optimizeFonts: false,
  experimental: { images: { allowFutureImage: true } },
  async redirects() {
    return [
      {
        source: "/signups",
        destination: "/signup",
        permanent: true,
      },
      {
        source: "/tournament",
        destination: "/tournament/matchups",
        permanent: false,
      },

      {
        source: "/tournament/matchup",
        destination: "/tournament/matchups",
        permanent: false,
      },
      {
        source: "/tournament/rule",
        destination: "/tournament/rules",
        permanent: false,
      },
    ];
  },
};
