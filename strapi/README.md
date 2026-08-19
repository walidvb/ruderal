# Strapi content types

The Strapi backend lives in its own project (see the "Strapi CMS Integration"
section of the root README). Copy `src/api/*` into that project's `src/api/`
and restart Strapi — the content types show up in the admin panel.

Then grant public read access under
**Settings → Users & Permissions → Roles → Public**: `find` (and `findOne` for
the collections) on each type, otherwise the API returns 403.

| Type | Kind | Fields |
| --- | --- | --- |
| `podcast` | collection | title, description, thumbnail, videoURL, date, tags |
| `study-group` | collection | title, description, image, date |
| `podcast-page` | single | title, description |
| `study-group-page` | single | title, description |
| `happening-page` | single | title, description |
| `about-page` | single | title, description |

`tags` is a JSON field (array of strings). The `*-page` single types are named
with a suffix because a single type cannot share a UID with a collection.
