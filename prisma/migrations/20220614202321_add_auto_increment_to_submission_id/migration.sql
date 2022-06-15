-- AlterTable
CREATE SEQUENCE "submission_id_seq";
ALTER TABLE "Submission" ALTER COLUMN "id" SET DEFAULT nextval('submission_id_seq');
ALTER SEQUENCE "submission_id_seq" OWNED BY "Submission"."id";
