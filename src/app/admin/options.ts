import type { NextAdminOptions } from "@premieroctet/next-admin";

export const options: NextAdminOptions = {
  title: "Ruderal Admin",
  model: {
    Podcast: {
      toString: (podcast) => podcast.title,
      title: "Podcasts",
      icon: "MicrophoneIcon",
      list: {
        display: ["title", "date", "tags", "publishedAt"],
        search: ["title", "description", "slug"],
        // Listings order by editorial date, not publication date.
        defaultSort: { field: "date", direction: "desc" },
      },
      edit: {
        display: [
          "title",
          "slug",
          "description",
          "date",
          "tags",
          "thumbnailUrl",
          "videoUrl",
          "publishedAt",
        ],
        fields: {
          publishedAt: {
            helperText:
              "Empty = draft. A past date publishes it; a future date schedules it.",
          },
          thumbnailUrl: {
            helperText:
              "Absolute URL, or a path inside the public `media` bucket (e.g. podcasts/ep-1.jpg).",
          },
          videoUrl: {
            helperText:
              "YouTube, Vimeo, Twitch, TikTok, Spotify or a direct file URL. The preview updates as you type.",
          },
        },
      },
    },
    StudyGroup: {
      toString: (studyGroup) => studyGroup.title,
      title: "Study groups",
      icon: "UserGroupIcon",
      list: {
        display: ["title", "date", "publishedAt"],
        search: ["title", "description", "slug"],
        defaultSort: { field: "date", direction: "desc" },
      },
      edit: {
        display: [
          "title",
          "slug",
          "description",
          "date",
          "imageUrl",
          "publishedAt",
        ],
        fields: {
          publishedAt: {
            helperText:
              "Empty = draft. A past date publishes it; a future date schedules it.",
          },
          imageUrl: {
            helperText:
              "Absolute URL, or a path inside the public `media` bucket (e.g. study-groups/intro.jpg).",
          },
        },
      },
    },
    Admin: {
      toString: (admin) => admin.email,
      title: "Admins",
      icon: "ShieldCheckIcon",
      list: {
        display: ["email", "name", "createdAt"],
        search: ["email", "name"],
        defaultSort: { field: "email", direction: "asc" },
      },
      edit: {
        display: ["email", "name"],
        fields: {
          email: {
            helperText:
              "Lowercase only. Adding an address here is all it takes \u2014 the Supabase user is created on their first sign-in.",
          },
        },
      },
    },
    Page: {
      toString: (page) => page.title,
      title: "Pages",
      icon: "DocumentTextIcon",
      list: {
        display: ["slug", "title", "publishedAt"],
        search: ["slug", "title"],
      },
      edit: {
        display: ["slug", "title", "description", "publishedAt"],
        fields: {
          slug: {
            helperText:
              "One of: podcast-page, study-group-page, happening-page, about-page.",
          },
          publishedAt: {
            helperText:
              "Empty = draft. A past date publishes it; a future date schedules it.",
          },
        },
      },
    },
  },
};
