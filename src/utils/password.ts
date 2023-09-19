import argon2 from "argon2";
import { getConfig } from "../config";

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await argon2.hash(
      // `${password}${getConfig().SECRET_PEPPER}`
      password
    );
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const isPasswordValid = await argon2.verify(
      // `${password}${getConfig().SECRET_PEPPER}`,
      password,
      hashedPassword
    );
    return isPasswordValid;
  } catch (error) {
    throw new Error("Error verifying password");
  }
}
