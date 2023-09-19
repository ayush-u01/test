import { PasswordController } from "./password.controller";
import { Router } from "express";
import type { Route } from "interfaces/route.interfaces";
import { createValidationPipe } from "middlewares/request-validator";
import { ChangePasswordDto, ForgetPasswordDto } from "./dto/password.dto";

export class PasswordRoute implements Route {
  public path = "/password";
  public router = Router();
  public passController = new PasswordController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(
      `${this.path}/submit`,
      createValidationPipe(ChangePasswordDto),
      this.passController.UpdateHandler
    );
    this.router.post(
      `${this.path}/update`,
      createValidationPipe(ForgetPasswordDto),
      this.passController.ForgetHandler
    );
  }
}
