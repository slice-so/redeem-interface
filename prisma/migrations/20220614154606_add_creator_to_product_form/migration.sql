/*
  Warnings:

  - Added the required column `creator` to the `ProductForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductForm" ADD COLUMN     "creator" TEXT NOT NULL;
