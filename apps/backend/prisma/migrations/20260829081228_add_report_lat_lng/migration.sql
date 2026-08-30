-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;

-- Prisma's drift diff wants to DROP INDEX "reports_embedding_hnsw_idx" here —
-- it's on an Unsupported("vector") column (see schema.prisma comment on
-- Report.embedding) so it isn't represented in schema.prisma and every
-- `migrate dev` will propose dropping it again. Deliberately removed from
-- this migration; do NOT let a future migrate dev re-add that DropIndex.
