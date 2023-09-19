import { AuthController } from "./auth.controller";
import { Router } from "express";

import type { Route } from "interfaces/route.interfaces";
import { createValidationPipe } from "middlewares/request-validator";
import { AuthDto, LoginDto } from "./dto/auth.dto";
import { RefreshTokenDto } from "./dto/refreshToken.dto";

export class AuthRoute implements Route {
  public path = "/auth";
  public router = Router();
  public authController = new AuthController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      createValidationPipe(AuthDto),
      this.authController.SignUpHandler
    );
    this.router.post(
      `${this.path}/refreshToken`,
      createValidationPipe(RefreshTokenDto),
      this.authController.RefreshTokenHandler
    );
    this.router.post(
      `${this.path}/authme`,
      this.authController.AuthMeHandler
    );
    this.router.post(`${this.path}/login`, this.authController.LoginHandler);
  }
}
