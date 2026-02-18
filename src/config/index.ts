/**
 * @Copyright 2027 Classless
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  WHITELISTED_DOMAINS: ['https://docs.blog-api.classless.com'],
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

export default config;
