import { Request as ExpressRequest, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import prisma from "lib/prisma-client";
import { getConfig } from "config";
import { DecodedToken, setAccessToken, verifyRefreshToken } from "utils/token";
import { accessExpiresInMilliseconds, globalConstants } from "lib/constants";

const publicAccessKey = path.join(
  __dirname,
  "..",
  "..",
  "keys",
  "accessToken",
  "public.key"
);
interface Request extends ExpressRequest {
  user?: DecodedToken;
}

export const AuthMe = async (req: Request, res: Response) => {
  try {
    const authorization = req.headers.authorization as string;
    if (!authorization) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }
    // console.log(authorization);
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) {
      throw new Error(
        'Invalid Authorization header format. Format is "Bearer <token>".'
      );
    }
    // console.log(token);

    try {
      const publicKey = await fs.promises.readFile(publicAccessKey, "utf-8");
      console.log(publicAccessKey);
      const options: SignOptions = {
        algorithm: "RS256",
        issuer: "Diagnoos",
      };
      const decoded = jwt.verify(token, publicKey, options) as DecodedToken;
      const CurrentUser = await prisma.auth.findUnique({
        where: {
          authid: decoded.authid,
        },
      });
      console.log(decoded, "dec");

      if (!CurrentUser) {
        throw new Error("Access token not found or expired");
      }

      req.user = { authid: decoded.authid };

      const response = {
        user: CurrentUser,
        tokens: {
          accessToken: token,
        },
      };
      return response;
    } catch (err) {
      if ((err as Error).name !== "TokenExpiredError") {
        throw new Error("Invalid access token");
      }
      // Get Refresh-Token
      const refreshToken = req.get("X-Refresh-Token") as string;

      if (!refreshToken) {
        throw new Error("Refresh token missing");
      }
      const [bearer, token] = refreshToken.split(" ");
      if (bearer !== "Bearer" || !token) {
        throw new Error(
          'Invalid Authorization header format. Format is "Bearer <token>".'
        );
      }
      const decoded = await verifyRefreshToken(token);
      const { authid, email, phoneNo } = decoded;
      const newAccessToken = await setAccessToken({
        authid: authid,
        email: email,
        phoneNo: phoneNo,
      });

      // Attach user object to request and proceed with new access token
      req.user = { authid: decoded.authid };

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        expires: new Date(Date.now() + accessExpiresInMilliseconds),
      });
      const response = {
        user: {
          authid,
          email,
          phoneNo,
        },
        tokens: {
          accessToken: newAccessToken,
        },
      };
      return response;
    }
  } catch (err) {
    return res
      .status(globalConstants.statusCode.UnauthorizedException.code)
      .json({
        status: globalConstants.status.failed,
        message: (err as Error).message,
        data: null,
      });
  }
};
