-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "votes_count" INTEGER NOT NULL DEFAULT 0;

-- Backfill votes_count for any rows/votes that existed before this migration
UPDATE "reports" r
SET "votes_count" = (SELECT COUNT(*) FROM "votes" v WHERE v.report_id = r.id);

-- CreateFunction: keep reports.votes_count in sync with the votes table
CREATE OR REPLACE FUNCTION sync_report_votes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE "reports" SET "votes_count" = "votes_count" + 1 WHERE "id" = NEW."report_id";
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE "reports" SET "votes_count" = "votes_count" - 1 WHERE "id" = OLD."report_id";
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- CreateTrigger
CREATE TRIGGER votes_count_trigger
AFTER INSERT OR DELETE ON "votes"
FOR EACH ROW
EXECUTE FUNCTION sync_report_votes_count();
