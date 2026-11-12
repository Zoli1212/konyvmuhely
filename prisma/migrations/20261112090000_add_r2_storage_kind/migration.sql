-- Cloudflare R2 as a third storage driver.
--
-- Added rather than replacing BLOB: rows written before the move keep their
-- BLOB value and go on reading from Vercel Blob, so the switch is reversible
-- by unsetting the R2 environment variables.
ALTER TYPE "StorageKind" ADD VALUE IF NOT EXISTS 'R2';
