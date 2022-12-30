/*
  Warnings:

  - The `linkedProducts` column on the `Form` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "linkedProducts",
ADD COLUMN     "linkedProducts" JSONB NOT NULL DEFAULT '{}';
