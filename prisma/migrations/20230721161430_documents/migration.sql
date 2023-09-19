-- CreateTable
CREATE TABLE "Document" (
    "documentId" TEXT NOT NULL,
    "chat" TEXT[],
    "authId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("documentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_documentId_key" ON "Document"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_authId_key" ON "Document"("authId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_authId_fkey" FOREIGN KEY ("authId") REFERENCES "auth"("authid") ON DELETE RESTRICT ON UPDATE CASCADE;
