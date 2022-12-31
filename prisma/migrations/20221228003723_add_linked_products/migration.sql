-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "linkedProducts" JSONB[] DEFAULT ARRAY[]::JSONB[];
