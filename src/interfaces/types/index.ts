import { Auth, Document, Pdf } from "@prisma/client";

export type SafeAuth = {
  user: Omit<Auth, "hashedPassword" | "otp" | "refreshToken">;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export type SafeLogin = {
  user: Auth;
};

export type SafeChat = {
  document: Document;
};

export type SafeGetChat = {
  document: Document[];
};

export type SafePdf = {
  pdf: Pdf;
};
