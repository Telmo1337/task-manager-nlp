import { StringValue } from "ms";

// Enforce required environment variables in production
const isProduction = process.env.NODE_ENV === "production";

function getRequiredEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value && isProduction) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  if (!value) {
    console.warn(`⚠️  Warning: Using default ${key} - DO NOT use in production!`);
    return `dev-${key.toLowerCase()}-not-for-production`;
  }
  return value;
}

export const authConfig = {
  jwtSecret: getRequiredEnv("JWT_SECRET"),
  jwtRefreshSecret: getRequiredEnv("JWT_REFRESH_SECRET"),
  accessTokenExpiresIn: "15m" as StringValue,
  refreshTokenExpiresIn: "7d" as StringValue,
  saltRounds: 12, // Increased from 10 for better security
};
