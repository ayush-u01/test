-- CreateTable
CREATE TABLE "auth" (
    "authid" TEXT NOT NULL,
    "email" TEXT,
    "phoneNo" TEXT,
    "hashedPassword" TEXT NOT NULL,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("authid")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_authid_key" ON "auth"("authid");

-- CreateIndex
CREATE UNIQUE INDEX "auth_email_key" ON "auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_phoneNo_key" ON "auth"("phoneNo");
