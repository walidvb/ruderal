-- CreateTable
CREATE TABLE "admins" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- Sign-in lowercases the address before looking it up, so a mixed-case row
-- would be unreachable. Fail the write instead of locking someone out.
-- Prisma does not model CHECK constraints, so this is hand-written and is
-- invisible to `prisma migrate diff` -- it will not show up as drift.
ALTER TABLE "admins"
    ADD CONSTRAINT "admins_email_lowercase" CHECK ("email" = lower("email"));

-- ---------------------------------------------------------------------------
-- Row level security
--
-- No policies: the allowlist must never be readable through the publishable
-- key, or anyone could enumerate who can log in. Prisma connects as the table
-- owner and bypasses RLS, which is how the admin UI still reads and writes it.
-- ---------------------------------------------------------------------------

ALTER TABLE "admins" ENABLE ROW LEVEL SECURITY;
