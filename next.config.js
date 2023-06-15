const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'sameorigin'
  }
];

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});
module.exports = withPWA({
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    API_INTERACTION: process.env.API_INTERACTION,
    API_SUBSCRIPTION: process.env.API_SUBSCRIPTION,
    CLIENT_ID: process.env.CLIENT_ID,
    API_TRACKING: process.env.API_TRACKING,
    MODE: process.env.MODE
  },
  images: {
    domains: ['s3.icankid.io', 's3.stag.icankids.com.vn']
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  }
});
