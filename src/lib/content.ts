import { createClient } from "@/lib/supabase/server";

/**
 * Public reads go through the publishable key, never Prisma: Prisma connects as
 * the table owner and so bypasses RLS, which would leak drafts and scheduled
 * rows onto the public site. RLS already restricts these tables to live rows,
 * so no query here adds a `published_at` filter of its own.
 */

/** One listing item. Podcasts and study groups are rendered by the same grid. */
export type Entry = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  date: string | null;
};

export type PageCopy = {
  slug: string;
  title: string;
  description: string | null;
};

/** `thumbnail_url` / `image_url` hold either an absolute URL or a path in the public `media` bucket. */
function mediaUrl(path: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
}

export async function getPodcasts(): Promise<Entry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("podcasts")
    .select("id, slug, title, description, thumbnail_url, video_url, date")
    .order("date", { ascending: false, nullsFirst: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    imageUrl: mediaUrl(row.thumbnail_url),
    videoUrl: row.video_url,
    date: row.date,
  }));
}

export async function getStudyGroups(): Promise<Entry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_groups")
    .select("id, slug, title, description, image_url, date")
    .order("date", { ascending: false, nullsFirst: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    imageUrl: mediaUrl(row.image_url),
    videoUrl: null,
    date: row.date,
  }));
}

/**
 * Happenings have no table yet, so they borrow the near-identical study group
 * shape. Swap this body for a `happenings` query once that model lands.
 */
export async function getHappenings(): Promise<Entry[]> {
  return getStudyGroups();
}

/** Editorial copy for a static page, keyed by slug (e.g. `podcast-page`). */
export async function getPageCopy(slug: string): Promise<PageCopy | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("slug, title, description")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}
