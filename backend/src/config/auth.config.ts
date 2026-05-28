import { randomBytes } from "crypto";
import { StringValue } from "ms";

const isProduction = process.env.NODE_ENV === "production";

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value && isProduction) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  if (!value) {
    // Random per-startup secret: tokens are invalidated on each restart (fine for dev).
    const generated = randomBytes(32).toString("hex");
    console.warn(
      `⚠️  ${key} not set — generated a random secret for this run. Tokens will be invalidated on restart. Set ${key} in .env to avoid this.`
    );
    return generated;
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
