import {
  IsPhoneNumber,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
} from "class-validator";

//   @IsPhoneNumber(undefined, { message: "Invalid phone number", region: "IN" })
export class ForgetPasswordDto {
  @IsString()
  readonly email: string;
}

export class ChangePasswordDto {
  @IsString()
  readonly oldPassword: string;

  @IsString()
  readonly newPassword: string;

  @IsString()
  readonly authId: string;
}
