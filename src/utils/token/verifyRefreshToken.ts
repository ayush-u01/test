import jwt, { SignOptions } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Payload } from ".";
import prisma from "lib/prisma-client";

const publicRefreshKey = path.join(
  __dirname,
  "..",
  "..",
  "keys",
  "refreshToken",
  "public.key"
);

export async function verifyRefreshToken(token: string): Promise<Payload> {
  try {
    const publicKey = await fs.promises.readFile(publicRefreshKey, "utf-8");
    const options: SignOptions = {
      algorithm: "RS256",
      issuer: "Diagnoos",
    };

    const decoded = jwt.verify(token, publicKey, options) as Payload;
    // now we need to check the refresh token present in db

    const cachedToken = await prisma.auth.findUnique({
      where: {
        authid: decoded.authid,
      },
      select: {
        refreshToken: true,
      },
    });

    if (!cachedToken?.refreshToken || cachedToken.refreshToken !== token) {
      throw new Error("Refresh token not found or expired");
    }

    return decoded;
  } catch (err) {
    throw new Error(`Failed to verify JWT: ${(err as Error).message}`);
  }
}
