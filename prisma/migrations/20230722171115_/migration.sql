/*
  Warnings:

  - You are about to drop the `auth` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_authId_fkey";

-- DropIndex
DROP INDEX "Document_authId_key";

-- DropTable
DROP TABLE "auth";

-- CreateTable
CREATE TABLE "Auth" (
    "authid" TEXT NOT NULL,
    "email" TEXT,
    "phoneNo" TEXT,
    "hashedPassword" TEXT NOT NULL,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("authid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_authid_key" ON "Auth"("authid");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_phoneNo_key" ON "Auth"("phoneNo");
