import { SafeLogin } from "interfaces/types";
import { AuthDto } from "./dto/auth.dto";
import { verifyPassword } from "utils/password";
import prisma from "lib/prisma-client";
import { error } from "console";
import argon2 from "argon2";

export class loginService {
  private readonly prisma = prisma;
  constructor() {}

  public async checkUser(UseremailOrPhoneNo: string, FieldName: string) {
    const existingUser = await this.prisma.auth.findUnique({
      where: { [FieldName]: UseremailOrPhoneNo },
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

  public async findUser(UseremailOrPhoneNo: string, FieldName: string) {
    const existingUser = await this.prisma.auth.findUnique({
      where: { [FieldName]: UseremailOrPhoneNo },
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

  public async login(data: AuthDto): Promise<SafeLogin | undefined> {
    if (data.isEmail) {
      // first need to check is user exists using the email address
      const ifUser = await this.checkUser(data.email, "email");

      if (ifUser) {
        const d_user = await this.findUser(data.email, "email");

        const pass: string | undefined = d_user?.hashedPassword;

        const checkPass = await verifyPassword(`${pass}`, data.password);
        if (checkPass) {
          const response = {
            user: {
              authid: d_user?.authid,
              email: d_user?.email,
              phoneNo: d_user?.phoneNo,
              refreshToken: d_user?.refreshToken,
            },
          };
          return response as SafeLogin;
        } else {
          throw error("password doesn't match!");
        }
      } else {
        throw error("user doesn't exist, create an account!");
      }
    } else {
      const ifUser = await this.checkUser(data.phoneNo, "phoneNo");
      if (ifUser) {
        const d_user = await this.findUser(data.phoneNo, "phoneNo");

        const pass: string | undefined = d_user?.hashedPassword;

        const checkPass = await verifyPassword(`${pass}`, data.password);
        if (checkPass) {
          const response = {
            user: {
              authid: d_user?.authid,
              email: d_user?.email,
              phoneNo: d_user?.phoneNo,
              refreshToken: d_user?.refreshToken,
            },
          };
          return response as SafeLogin;
        } else {
          throw error("password doesn't match!");
        }
      } else {
        throw error("user doesn't exist, create an account!");
      }
    }
  }
}
