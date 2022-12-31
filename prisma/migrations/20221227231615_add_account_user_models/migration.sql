/*
  Warnings:

  - You are about to drop the column `productform_id` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `ProductForm` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `form_id` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_productform_id_fkey";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "productform_id",
ADD COLUMN     "form_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ProductForm";

-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "slicer_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "questions" JSONB[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "slicerId" ON "Form"("slicer_id");

-- CreateIndex
CREATE INDEX "productId" ON "Form"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Form_slicer_id_product_id_key" ON "Form"("slicer_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_buyer_fkey" FOREIGN KEY ("buyer") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
