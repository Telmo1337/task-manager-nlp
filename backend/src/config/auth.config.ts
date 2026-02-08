import { StringValue } from "ms";

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || "your-super-secret-key-change-in-production",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-change-in-production",
  accessTokenExpiresIn: "15m" as StringValue,
  refreshTokenExpiresIn: "7d" as StringValue,
  saltRounds: 10,
};
