-- The shelf shown as "Yoga & Kundalíni" was stored as ESOTERIC, which only
-- worked while no shelf was actually called Ezoterika. Rename it to match
-- what buyers see, then free the old name for the new shelf.
--
-- Written by hand: Prisma's generated migration for an enum change drops and
-- recreates the type, which would take the column's data with it.
ALTER TYPE "BookCategory" RENAME VALUE 'ESOTERIC' TO 'YOGA';
ALTER TYPE "BookCategory" ADD VALUE 'ESOTERIC';
