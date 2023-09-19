import { NextFunction, Request, RequestHandler, Response } from "express";
import { SignupService } from "./signup.service";
import { CustomResponse } from "interfaces/response.interface";
import Api from "lib/Api";
import { globalConstants } from "lib/constants";
import { Auth } from "@prisma/client";
import { RefreshToken } from "./refreshToken.service";
import { loginService } from "./login.service";
import { log } from "console";
import { AuthMe } from "./AuthMe.service";

export class AuthController extends Api {
  private SignupService: SignupService;
  private RefreshService: RefreshToken;
  private LoginService: loginService;
  constructor() {
    super();
    this.SignupService = new SignupService();
    this.RefreshService = new RefreshToken();
    this.LoginService = new loginService();
  }

  public SignUpHandler: RequestHandler = async (
    req: Request,
    res: Response<CustomResponse<Auth>>,
    next: NextFunction
  ) => {
    try {
      const AuthUser = await this.SignupService.SignUp(req.body);
      this.send(res, AuthUser, "user created successfully");
    } catch (error) {
      next(error);
    }
  };

  public RefreshTokenHandler: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = await this.RefreshService.refreshAccessToken(req, res);

      this.send(res, token, "new access token");
    } catch (err) {
      next(err);
    }
  };

  public LoginHandler: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const logIn = await this.LoginService.login(req.body);
      this.send(res, logIn, "user logged in!");
    } catch (err) {}
  };

  public AuthMeHandler: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const CurrentUser = await AuthMe(req, res);

      this.send(res, CurrentUser, "your profile");
    } catch (err) {
      next(err);
    }
  };
}
