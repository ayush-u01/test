import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { DecodedToken, Payload } from ".";
import { accessExpiresInMilliseconds, globalConstants } from "lib/constants";
import { HttpExceptionError } from "exceptions/http.exception";
import { verifyRefreshToken } from "./verifyRefreshToken";
import { setAccessToken } from "./setAccessToken";
import { getConfig } from "../../config";

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

export async function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // check whether token present in authorization header or not

    const authorization = req.headers.authorization as string;
    if (!authorization) {
      return res
        .status(globalConstants.statusCode.UnauthorizedException.code)
        .json({
          status: globalConstants.status.failed,
          message: "No authorization header | not authorized",
          data: null,
        });
    }

    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) {
      throw new HttpExceptionError(
        400,
        'Invalid authorization header format. Format is "Bearer <token>".'
      );
    }

    try {
      const publicKey = await fs.promises.readFile(publicAccessKey, "utf-8");
      //   options
      const options: SignOptions = {
        algorithm: "RS256",
        issuer: "Diagnoos",
      };
      const decoded = jwt.verify(token, publicKey, options) as DecodedToken;
      req.user = { authid: decoded.authid };
      return next();
    } catch (err) {
      if ((err as Error).name !== "TokenExpiredError") {
        throw new Error("Invalid access token");
      }

      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error("Refresh token missing");
      }

      const decoded = await verifyRefreshToken(refreshToken);

      const { authid, email, phoneNo } = decoded;

      const newAccessToken = await setAccessToken({
        authid,
        email,
        phoneNo,
      });
      req.user = { authid: decoded.authid };

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        expires: new Date(Date.now() + accessExpiresInMilliseconds),
      });
      return next();
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
}
