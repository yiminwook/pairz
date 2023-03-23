/** @type {import('next').NextConfig} */
const path = require("path");

const {
  PROTOCOL,
  HOST,
  PORT,
  FIREBASE_PROJECT_ID,
  FIREBASE_AUTH_API_KEY,
  FIREBASE_AUTH_AUTH_DOMAIN,
  AWS_S3_BUCKET,
  AWS_S3_REGION,
} = process.env;

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
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: [
      `${AWS_S3_BUCKET}.s3.${AWS_S3_REGION}.amazonaws.com`,
      "lh3.googleusercontent.com",
    ],
  },
};
