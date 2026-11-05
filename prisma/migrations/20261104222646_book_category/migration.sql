-- CreateEnum
CREATE TYPE "BookCategory" AS ENUM ('BUDDHIST', 'ESOTERIC');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "category" "BookCategory" NOT NULL DEFAULT 'BUDDHIST';
