-- A fourth shelf. Hand-written for the same reason as the last one: Prisma's
-- generated migration for an enum change drops and recreates the type, which
-- would take the column's data with it.
ALTER TYPE "BookCategory" ADD VALUE 'SCIENCE';
