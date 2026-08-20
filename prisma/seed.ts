import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const daysAhead = (n: number) => new Date(Date.now() + n * 86_400_000);

// `published_at` null = draft, past = live, future = scheduled.
const podcasts = [
  {
    slug: "ruderal-01-broken-ground",
    title: "Broken Ground",
    description:
      "What grows first after disturbance, and why the pioneers are never the ones that stay.",
    thumbnailUrl: "podcasts/ep-01.jpg",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    date: new Date("2026-02-11"),
    tags: ["ecology", "succession"],
    publishedAt: daysAgo(120),
  },
  {
    slug: "ruderal-02-the-seed-bank",
    title: "The Seed Bank",
    description:
      "Dormancy as a strategy: what a soil remembers, and how long it can wait.",
    thumbnailUrl: "podcasts/ep-02.jpg",
    videoUrl: "https://vimeo.com/76979871",
    date: new Date("2026-03-24"),
    tags: ["ecology", "time"],
    publishedAt: daysAgo(85),
  },
  {
    slug: "ruderal-03-edges-and-margins",
    title: "Edges and Margins",
    description:
      "Roadsides, rubble lots, rail cuttings — a conversation about the places nobody designs.",
    thumbnailUrl: "podcasts/ep-03.jpg",
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    date: new Date("2026-05-02"),
    tags: ["urbanism", "landscape"],
    publishedAt: daysAgo(40),
  },
  {
    slug: "ruderal-04-weed-is-a-verdict",
    title: "Weed Is a Verdict",
    description:
      "On the politics of naming a plant undesirable, and who gets to decide.",
    thumbnailUrl: "podcasts/ep-04.jpg",
    videoUrl: null,
    date: new Date("2026-06-18"),
    tags: ["politics", "language", "ecology"],
    publishedAt: daysAgo(9),
  },
  {
    // Scheduled: visible to the admin, invisible to the public key until the date passes.
    slug: "ruderal-05-after-the-fire",
    title: "After the Fire",
    description: "Pyrophytes, serotiny, and the uses of catastrophe.",
    thumbnailUrl: "podcasts/ep-05.jpg",
    videoUrl: null,
    date: new Date("2026-09-01"),
    tags: ["ecology", "fire"],
    publishedAt: daysAhead(12),
  },
  {
    // Draft.
    slug: "ruderal-06-untitled",
    title: "Untitled (working)",
    description: null,
    thumbnailUrl: null,
    videoUrl: null,
    date: null,
    tags: [],
    publishedAt: null,
  },
];

const studyGroups = [
  {
    slug: "reading-the-vegetal",
    title: "Reading the Vegetal",
    description:
      "Six sessions on plant thinking — Marder, Coccia, Hall. Fortnightly, in person.",
    imageUrl: "study-groups/reading-the-vegetal.jpg",
    date: new Date("2026-03-05"),
    publishedAt: daysAgo(100),
  },
  {
    slug: "disturbance-ecologies",
    title: "Disturbance Ecologies",
    description:
      "A close reading group around succession, resilience and the aftermath of extraction.",
    imageUrl: "study-groups/disturbance-ecologies.jpg",
    date: new Date("2026-04-20"),
    publishedAt: daysAgo(55),
  },
  {
    slug: "field-recording-practicum",
    title: "Field Recording Practicum",
    description:
      "Hands-on sessions on capturing sound in marginal terrain. Bring headphones.",
    imageUrl: "study-groups/field-recording.jpg",
    date: new Date("2026-07-08"),
    publishedAt: daysAhead(20),
  },
  {
    slug: "soil-literacies",
    title: "Soil Literacies",
    description: null,
    imageUrl: null,
    date: null,
    publishedAt: null,
  },
];

// Placeholder copy so the info panel has something to expand into. `title` is
// the panel's heading; the short label next to it ("Podcast Info") is nav
// chrome and lives with the menu, not here.
const pages = [
  {
    slug: "podcast-page",
    title: "Documenting Artistic Practices and Circulating Knowledge",
    description:
      "Ruderal produces and shares editorial and audio content emerging through multidisciplinary artistic practices in conversation with other fields of knowledge. Conceived as a platform for documentation and transmission, the podcast programme gives visibility to creative processes, critical reflections and situated experiences that often remain outside final artistic outputs. Through conversations, recordings and shared narratives, it contributes to building accessible resources that support exchange, reflection and public engagement across disciplines and communities.",
  },
  {
    slug: "study-group-page",
    title: "Research, Learning and Collective Experimentation",
    description:
      "Study groups gather around a shared text, a shared question or a shared practice, meeting regularly over a season. They are deliberately small and deliberately unfinished: reading is collective, conclusions are provisional, and the work of one session is the starting point of the next. Sessions are open to anyone willing to read alongside others, with no prerequisite beyond attention.",
  },
  {
    slug: "happening-page",
    title: "Cultural Participation and Territorial Cooperation",
    description:
      "Happenings are temporary, situated and often outdoors: a walk, a screening, a meal, a listening session in a place that is between uses. Each one is made with the people already using the site, and leaves as little trace as it can. They are announced close to the date and documented afterwards, so that what happens once can still circulate.",
  },
  {
    slug: "about-page",
    title: "Extending Ecological Logic into Cultural Realms",
    description:
      "Ruderal takes its name from the ecological term ruderal, derived from the Latin rudus — rubble, debris, disturbed ground. In ecology, ruderal species are plants that thrive in disrupted, abandoned or transitional environments: wastelands, margins, cracks and interstitial spaces. They grow where established orders begin to fragment, transforming sites of rupture into fertile ground. Both indicators of change and agents of resilience, they embody the capacity for new forms of life to emerge within unstable conditions.\n\nRuderal extends this ecological logic into the social, cultural, technological and environmental realms. Based in Geneva — a territory shaped by dense networks of knowledge, practices, migrations, institutions and initiatives — the association understands human and intellectual diversity as a living resource to be activated. Rooted in everyday life and in a concrete place, Ruderal operates within the interstices: between home and neighbourhood, between institutions and vernacular uses, between ecology, creation and transmission.",
  },
];

async function main() {
  for (const podcast of podcasts) {
    await prisma.podcast.upsert({
      where: { slug: podcast.slug },
      create: podcast,
      update: podcast,
    });
  }

  for (const studyGroup of studyGroups) {
    await prisma.studyGroup.upsert({
      where: { slug: studyGroup.slug },
      create: studyGroup,
      update: studyGroup,
    });
  }

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      create: { ...page, publishedAt: daysAgo(1) },
      // Republishing is left to the admin; only the copy is refreshed here.
      update: page,
    });
  }

  const [podcastCount, studyGroupCount, pageCount] = await Promise.all([
    prisma.podcast.count(),
    prisma.studyGroup.count(),
    prisma.page.count(),
  ]);

  console.log(
    `podcasts: ${podcastCount}, study_groups: ${studyGroupCount}, pages: ${pageCount}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
