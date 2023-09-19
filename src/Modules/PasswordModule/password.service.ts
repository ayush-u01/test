import { globalConstants } from "../../lib/constants";
import prisma from "lib/prisma-client";
import type { Auth } from "@prisma/client";
import { HttpExceptionError } from "exceptions/http.exception";
import { SafeAuth } from "interfaces/types";
import { ChangePasswordDto, ForgetPasswordDto } from "./dto/password.dto";
import { hashPassword, verifyPassword } from "utils/password";
import { setAccessToken, setRefreshToken } from "utils/token";
import { error } from "console";
var nodemailer = require("nodemailer");

interface GetData {
  userId: string;
}

export class PasswordService {
  private readonly prisma = prisma;
  private readonly hashPassword = hashPassword;
  private readonly verifyPass = verifyPassword;
  constructor() {}

  public async checkUser(User: string, FieldName: string): Promise<Boolean> {
    const existingUser = await this.prisma.auth.findUnique({
      where: { [FieldName]: User },
      select: {
        authid: true,
      },
    });
    if (existingUser) {
      return true;
    } else {
      return false;
    }
  }

  public async findUser(User: string, FieldName: string) {
    const existingUser = await this.prisma.auth.findUnique({
      where: { [FieldName]: User },
      select: {
        authid: true,
        email: true,
        phoneNo: true,
        hashedPassword: true,
        refreshToken: true,
      },
    });

    return existingUser;
  }

  public async Change(
    authId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<SafeAuth> {
    const user = await this.checkUser(authId, "authid");
    if (user) {
      const existingUser = await this.findUser(authId, "authid");
      const pass = existingUser?.hashedPassword;
      const checkPass = await verifyPassword(`${pass}`, oldPassword);
      if (checkPass) {
        const hashedPassword = await this.hashPassword(newPassword);

        const changePass = await this.prisma.auth.update({
          where: { authid: authId },
          data: {
            hashedPassword: hashedPassword,
            updatedAt: new Date(),
          },
          select: {
            authid: true,
            email: true,
            phoneNo: true,
            hashedPassword: true,
            refreshToken: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        const accessToken = await setAccessToken({
          authid: changePass.authid,
          email: changePass.email,
          phoneNo: changePass.phoneNo,
        });

        const refreshToken = await setRefreshToken({
          authid: changePass.authid,
          email: changePass.email,
          phoneNo: changePass.phoneNo,
        });

        const response = {
          user: changePass,
          tokens: {
            accessToken,
            refreshToken,
          },
        };

        return response as SafeAuth;
      } else {
        throw error("password doesn't match!");
      }
    } else {
      throw error("user doesn't exist, create an account!");
    }
  }

  public async ChangePass(data: ChangePasswordDto): Promise<SafeAuth> {
    // checkUniqueProfile;
    const report = await this.Change(
      data.authId,
      data.oldPassword,
      data.newPassword
    );
    return report;
  }

  public async ForgetPass(data: ForgetPasswordDto): Promise<SafeAuth> {
    const user = await this.checkUser(data.email, "email");
    if (user) {
      const pass = String(Math.random() * 1000);
      const hashedPassword = await this.hashPassword(pass);
      const profile = await this.prisma.auth.update({
        where: { email: data.email },
        data: {
          hashedPassword: hashedPassword,
          updatedAt: new Date(),
        },
        select: {
          authid: true,
          email: true,
          phoneNo: true,
          hashedPassword: true,
          refreshToken: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const accessToken = await setAccessToken({
        authid: profile.authid,
        email: profile.email,
        phoneNo: profile.phoneNo,
      });

      const refreshToken = await setRefreshToken({
        authid: profile.authid,
        email: profile.email,
        phoneNo: profile.phoneNo,
      });

      const response = {
        user: profile,
        tokens: {
          accessToken,
          refreshToken,
        },
      };

      //   https://myaccount.google.com/apppasswords
      var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "hardik.chhabra.ug20@nsut.ac.in",
          pass: "vwciymrtmkvegjcg",
        },
      });

      var mailOptions = {
        from: "hardik.chhabra.ug20@nsut.ac.in",
        to: data.email,
        subject: "Your new password",
        text: `This is your new password for your account: ${pass}`,
      };

      transporter.sendMail(mailOptions, function (error: any) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: ");
        }
      });

      return response as SafeAuth;
    } else {
      throw error("user doesn't exist, create an account!");
    }
  }
}
