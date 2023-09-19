import jwt, { SignOptions } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { getConfig } from "../../config";
import { Payload } from ".";
import { HttpExceptionError } from "exceptions/http.exception";

const privateRefreshKey = path.join(
  __dirname,
  "..",
  "..",
  "keys",
  "refreshToken",
  "private.key"
);

export async function setRefreshToken(payload: Payload) {
  try {
    const privateKey = await fs.promises.readFile(privateRefreshKey, "utf-8");
    const options: SignOptions = {
      algorithm: "RS256",
      expiresIn: getConfig().JWT_REFRESH_TOKEN_EXPIRATION,
      issuer: "Diagnoos",
      audience: `user_id-${payload.authid}`,
      subject: "refresh-token",
    };
    const token = jwt.sign(payload, privateKey, options);
    return token;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
