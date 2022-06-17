/*
  Warnings:

  - The `questions` column on the `ProductForm` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ProductForm" DROP COLUMN "questions",
ADD COLUMN     "questions" JSONB[];
