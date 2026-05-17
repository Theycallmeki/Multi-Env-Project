import path from "path";
import dotenv from "dotenv";

const env = process.env.NODE_ENV || 'development';

const envFilePath = path.resolve(process.cwd(), `.env.${env}`);
const result = dotenv.config({ path: envFilePath });

if (result.error) {
  console.warn(`[env] Warning: Could not load ${envFilePath}`);
}

const REQUIRED = ['PORT', 'NODE_ENV', 'JWT_SECRET', 'DB_HOST', 'DB_NAME', 'DB_USER'];
REQUIRED.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`[env] Missing required environment variable: "${key}"`);
  }
});

module.exports = {
  env,
  isProduction: env === 'production',
  isStaging: env === 'staging',
  isDevelopment: env === 'development',

  app: {
    name: process.env.APP_NAME || 'Multi-Env Server',
    port: parseInt(process.env.PORT, 10) || 3000,
    url: process.env.APP_URL || 'http://localhost:3000',
  },

  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
};
