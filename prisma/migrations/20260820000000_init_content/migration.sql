-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "podcasts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,
    "video_url" TEXT,
    "date" DATE,
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMPTZ(6),

    CONSTRAINT "podcasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_groups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "date" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMPTZ(6),

    CONSTRAINT "study_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMPTZ(6),

    CONSTRAINT "pages_pkey" PRIMARY KEY ("slug")
);

-- CreateIndex
CREATE UNIQUE INDEX "podcasts_slug_key" ON "podcasts"("slug");

-- CreateIndex
CREATE INDEX "podcasts_date_idx" ON "podcasts"("date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "study_groups_slug_key" ON "study_groups"("slug");

-- CreateIndex
CREATE INDEX "study_groups_date_idx" ON "study_groups"("date" DESC);

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Publishing is enforced here, not in application code: `published_at` null
-- means draft, a past date means live, a future date means scheduled. The
-- anon/publishable key therefore only ever sees live rows, and app code must
-- never add its own published filter.
--
-- RLS is deliberately not FORCEd: Prisma connects as the table owner, which
-- bypasses RLS, so the admin keeps full read/write access to drafts.
-- ---------------------------------------------------------------------------

ALTER TABLE "podcasts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "study_groups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pages" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published podcasts are publicly readable"
    ON "podcasts"
    FOR SELECT
    TO anon, authenticated
    USING (published_at IS NOT NULL AND published_at <= now());

CREATE POLICY "Published study groups are publicly readable"
    ON "study_groups"
    FOR SELECT
    TO anon, authenticated
    USING (published_at IS NOT NULL AND published_at <= now());

CREATE POLICY "Published pages are publicly readable"
    ON "pages"
    FOR SELECT
    TO anon, authenticated
    USING (published_at IS NOT NULL AND published_at <= now());

-- ---------------------------------------------------------------------------
-- Media storage
--
-- `thumbnail_url` / `image_url` hold either an absolute URL or a path inside
-- this public bucket (e.g. `podcasts/ep-1.jpg`).
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;
