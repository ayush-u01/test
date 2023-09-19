import { NextFunction, Request, RequestHandler, Response } from "express";
import { PasswordService } from "./password.service";
import { CustomResponse } from "interfaces/response.interface";
import Api from "lib/Api";
import { Auth } from "@prisma/client";

export class PasswordController extends Api {
  private passService: PasswordService;
  constructor() {
    super();
    this.passService = new PasswordService();
  }

  public UpdateHandler: RequestHandler = async (
    req: Request,
    res: Response<CustomResponse<Auth>>,
    next: NextFunction
  ) => {
    try {
      const Profile = await this.passService.ChangePass(req.body);
      this.send(res, Profile, "password changed for admin!");
    } catch (error) {
      next(error);
    }
  };

  public ForgetHandler: RequestHandler = async (
    req: Request,
    res: Response<CustomResponse<Auth>>,
    next: NextFunction
  ) => {
    try {
      const Profile = await this.passService.ForgetPass(req.body);
      this.send(res, Profile, "mail sent!");
    } catch (error) {
      next(error);
    }
  };
}
