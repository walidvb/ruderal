-- Index the column every RLS policy filters on.
-- See https://supabase.com/docs/guides/database/postgres/row-level-security#rls-performance-recommendations

-- CreateIndex
CREATE INDEX "podcasts_published_at_idx" ON "podcasts"("published_at");

-- CreateIndex
CREATE INDEX "study_groups_published_at_idx" ON "study_groups"("published_at");

-- CreateIndex
CREATE INDEX "pages_published_at_idx" ON "pages"("published_at");
