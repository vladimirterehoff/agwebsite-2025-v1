/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  }
];

const nextConfig = {
  i18n,
  images: {
    domains: [
      'api.cleango-dev.php-dev.attractgroup.com',
      'app.cleango-dev.php-dev.attractgroup.com'
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig