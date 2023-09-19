import {
  IsPhoneNumber,
  IsNotEmpty,
  IsString,
  Validate,
  ValidationArguments,
  IsNumber,
  ValidationOptions,
  registerDecorator,
  IsMobilePhone,
  IsEmail,
  IsBoolean,
  IsOptional,
  ValidateIf,
  isString,
} from "class-validator";

//   @IsPhoneNumber(undefined, { message: "Invalid phone number", region: "IN" })
export class AuthDto {
  // @IsNumber()
  @IsBoolean()
  @IsNotEmpty()
  readonly isEmail: boolean;

  @ValidateIf((obj, value) => obj.isEmail === true)
  @IsEmail()
  readonly email: string;

  @ValidateIf((obj, value) => obj.isEmail === false)
  @IsString()
  @IsMobilePhone("en-IN")
  readonly phoneNo: string;

  @IsValidPassword()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: "isValidPassword",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return passwordRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return "Invalid password. It must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.";
        },
      },
    });
  };
}

export class LoginDto {
  @IsBoolean()
  @IsNotEmpty()
  readonly isEmail: boolean;

  @ValidateIf((obj, value) => obj.isEmail === true)
  @IsEmail()
  readonly email: string;

  @ValidateIf((obj, value) => obj.isEmail === false)
  @IsString()
  @IsMobilePhone("en-IN")
  readonly phoneNo: string;

  @IsValidPassword()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
