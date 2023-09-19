import jwt, { SignOptions } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Payload } from ".";
import { getConfig } from "../../config";
import { HttpExceptionError } from "exceptions/http.exception";

const privateAccessKey = path.join(
  __dirname,
  "..",
  "..",
  "keys",
  "accessToken",
  "private.key"
);

export async function setAccessToken(payload: Payload) {
  try {
    const privateKey = await fs.promises.readFile(privateAccessKey, "utf-8");

    const options: SignOptions = {
      algorithm: "RS256",
      expiresIn: getConfig().JWT_ACCESS_TOKEN_EXPIRATION,
      issuer: "Diagnoos",
      subject: "access_token",
      audience: `user_id-${payload.authid}`,
    };

    const token = jwt.sign(payload, privateKey, options);
    return token;
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
