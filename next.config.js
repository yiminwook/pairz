/** @type {import('next').NextConfig} */
const path = require('path');

const { PROTOCOL, HOST, PORT, FIREBASE_PROJECT_ID, FIREBASE_AUTH_API_KEY, FIREBASE_AUTH_AUTH_DOMAIN } = process.env;

module.exports = {
  // reactStrictMode: true,
  publicRuntimeConfig: {
    PROTOCOL,
    HOST,
    PORT,
    FIREBASE_PROJECT_ID,
    FIREBASE_AUTH_API_KEY,
    FIREBASE_AUTH_AUTH_DOMAIN,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    unoptimized: true,
    domains: [process.env.AWS_CLOUD_FRONT_URL, 'lh3.googleusercontent.com'],
  },
};
