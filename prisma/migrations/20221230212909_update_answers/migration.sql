/*
  Warnings:

  - Changed the type of `answers` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "answers",
ADD COLUMN     "answers" JSONB NOT NULL;
