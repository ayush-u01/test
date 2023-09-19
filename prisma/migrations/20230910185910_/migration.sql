-- CreateTable
CREATE TABLE "Pdf" (
    "pId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "authId" TEXT NOT NULL,

    CONSTRAINT "Pdf_pkey" PRIMARY KEY ("pId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pdf_pId_key" ON "Pdf"("pId");
