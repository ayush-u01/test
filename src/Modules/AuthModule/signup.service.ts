import { globalConstants } from "../../lib/constants";
import prisma from "lib/prisma-client";
import { AuthDto } from "./dto/auth.dto";
import type { Auth } from "@prisma/client";
import { HttpExceptionError } from "exceptions/http.exception";
import { hashPassword } from "utils/password";
import { setAccessToken, setRefreshToken } from "utils/token";
import { SafeAuth } from "interfaces/types";
// type SafeAuth = Omit<Auth, "hashedPassword" | "otp">;

export class SignupService {
  private readonly prisma = prisma;
  private readonly hashPassword = hashPassword;
  constructor() {}

  public async checkUserUniquenessByEmailOrPhone(
    emailOrPhoneNo: string,
    FieldName: string
  ) {
    const existingUserByEmailOrPhone = await this.prisma.auth.findUnique({
      where: { [FieldName]: emailOrPhoneNo },
      select: {
        authid: true,
      },
    });

    const errorObject = {
      [FieldName]: ["has already been taken"],
    };
    if (existingUserByEmailOrPhone) {
      throw new HttpExceptionError(400, {
        errors: {
          ...(existingUserByEmailOrPhone ? errorObject : {}),
        },
      });
    }
  }

  public async createUserByEmailOrPhone(
    FieldName: string,
    emailOrPhone: string,
    password: string
  ): Promise<SafeAuth> {
    const hashedPassword = await this.hashPassword(password);
    // before createing the user generate refresh token save to db
    // before createing the user generate access token

    const createdUser = await this.prisma.auth.create({
      data: {
        [FieldName]: emailOrPhone,
        hashedPassword: hashedPassword,
      },
      select: {
        authid: true,
        email: true,
        phoneNo: true,
      },
    });

    const accessToken = await setAccessToken({
      authid: createdUser.authid,
      email: createdUser.email,
      phoneNo: createdUser.phoneNo,
    });

    const refreshToken = await setRefreshToken({
      authid: createdUser.authid,
      email: createdUser.email,
      phoneNo: createdUser.phoneNo,
    });

    await this.prisma.auth.update({
      where: { authid: createdUser.authid },
      data: {
        refreshToken: refreshToken,
      },
    });

    const response = {
      user: createdUser,
      tokens: {
        accessToken,
        refreshToken,
      },
    };

    return response as SafeAuth;
  }

  public async SignUp(data: AuthDto): Promise<SafeAuth> {
    if (data.isEmail) {
      // first need to check is user exists using the email address

      await this.checkUserUniquenessByEmailOrPhone(data.email, "email");
      const createUserByEmail = await this.createUserByEmailOrPhone(
        "email",
        data.email,
        data.password
      );
      return createUserByEmail;
    } else {
      await this.checkUserUniquenessByEmailOrPhone(data.phoneNo, "phoneNo");
      const createUserByPhone = await this.createUserByEmailOrPhone(
        "phoneNo",
        data.phoneNo,
        data.password
      );
      return createUserByPhone;
    }
  }
}
