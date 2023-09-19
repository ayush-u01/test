export interface Config {
  env: string;
  server: {
    host: string;
    port: number;
  };
  log: {
    format: "combined" | "common" | "dev" | "short" | "tiny";
    level: "error" | "warn" | "info" | "http" | "debug";
  };
  baseURL: string;
  SECRET_PEPPER: string | undefined;
  JWT_SECRET_ACCESS_TOKEN: string;
  JWT_SECRET_REFRESH_TOKEN: string;
  JWT_ACCESS_TOKEN_EXPIRATION: string | undefined;
  JWT_REFRESH_TOKEN_EXPIRATION: string | undefined;
  JWT_ACCESS_TOKEN_COOKIE_EXPIRATION: number | undefined;
  JWT_REFRESH_TOKEN_COOKIE_EXPIRATION: number | undefined;
}
