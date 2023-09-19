import type { Config } from "interfaces/config.interfaces";
import dotenv from "dotenv";

dotenv.config();

export const productionConfig: Config = {
  env: "production",
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 8080,
  },
  log: {
    format: "tiny",
    level: "info",
  },
  baseURL: "https://localhost:8080",
  SECRET_PEPPER: String(process.env.SECRET_PEPPER) || "",
  JWT_SECRET_ACCESS_TOKEN: String(process.env.JWT_SECRET_ACCESS_TOKEN) || "",
  JWT_SECRET_REFRESH_TOKEN: String(process.env.JWT_SECRET_REFRESH_TOKEN) || "",
  JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
  JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION,

  JWT_ACCESS_TOKEN_COOKIE_EXPIRATION: Number(
    process.env.JWT_ACCESS_TOKEN_COOKIE_EXPIRATION
  ),
  JWT_REFRESH_TOKEN_COOKIE_EXPIRATION: Number(
    process.env.JWT_REFRESH_TOKEN_COOKIE_EXPIRATION
  ),
};
