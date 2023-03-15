/** @type {import('next').NextConfig} */
const path = require("path");

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_AUTH_API_KEY,
  FIREBASE_AUTH_AUTH_DOMAIN,
  FIREBASE_AUTH_STORAGE_BUCKET,
  FIREBASE_AUTH_MESSAGING_SENDER_ID,
  FIREBASE_AUTH_APP_ID,
  FIREBASE_AUTH_MEASUREMENT_ID,
} = process.env;

module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    FIREBASE_PROJECT_ID,
    FIREBASE_AUTH_API_KEY,
    FIREBASE_AUTH_AUTH_DOMAIN,
    FIREBASE_AUTH_STORAGE_BUCKET,
    FIREBASE_AUTH_MESSAGING_SENDER_ID,
    FIREBASE_AUTH_APP_ID,
    FIREBASE_AUTH_MEASUREMENT_ID,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};
