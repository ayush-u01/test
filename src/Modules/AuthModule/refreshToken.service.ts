import {
  DecodedToken,
  setAccessToken,
  setRefreshToken,
  verifyRefreshToken,
} from "utils/token";
import { SignupService } from "./signup.service";
import { Request as ExpressRequest, Response } from "express";
import { getConfig } from "../../config";
import { HttpExceptionError } from "exceptions/http.exception";
import prisma from "lib/prisma-client";
import {
  accessExpiresInMilliseconds,
  refreshExpiresInMilliseconds,
} from "lib/constants";

interface Request extends ExpressRequest {
  user?: DecodedToken;
}

export class RefreshToken {
  constructor() {}

  public async refreshAccessToken(req: Request, res: Response) {
    const { refreshToken: token } = req.body;

    try {
      // verify the refresh token

      const decoded = await verifyRefreshToken(token);

      // generate  a new refresh token
      const { authid, email, phoneNo } = decoded;

      const accessToken = await setAccessToken({
        authid,
        email,
        phoneNo,
      });

      const refreshToken = await setRefreshToken({
        authid,
        email,
        phoneNo,
      });

      await prisma.auth.update({
        where: {
          authid: authid,
        },
        data: {
          refreshToken: refreshToken,
        },
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        expires: new Date(Date.now() + accessExpiresInMilliseconds),
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        expires: new Date(Date.now() + refreshExpiresInMilliseconds),
      });
      return { accessToken };
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}
