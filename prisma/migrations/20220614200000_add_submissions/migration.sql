/*
  Warnings:

  - Added the required column `buyer` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "answers" TEXT[],
ADD COLUMN     "buyer" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "productformId" ON "Submission"("productform_id");

-- CreateIndex
CREATE INDEX "buyerAddress" ON "Submission"("buyer");
