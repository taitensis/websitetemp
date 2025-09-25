import { getCollection, type CollectionEntry } from "astro:content";

/**
 * A typed wrapper around our recipe content collection.
 * Keeping this close to the content layer prevents every page from
 * duplicating the same type assertions and guards.
 */
export type RecipeEntry = CollectionEntry<"recipes">;

export type RecipeSummary = {
  slug: string;
  title: string;
  tags: string[];
  total: number | null;
  date: Date | string | null;
  difficulty: "easy" | "medium" | "hard" | null;
  image: string | null;
  summary: string | null;
  featured: boolean;
};

const FALLBACK_TAGS = ["breakfast", "mains", "dessert"] as const;
const SEASONS = ["winter", "spring", "summer", "autumn"] as const;

const toTimestamp = (input: unknown): number => {
  if (input instanceof Date) return input.getTime();
  if (typeof input === "string") {
    const parsed = Date.parse(input);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const normaliseSeason = (value: unknown): (typeof SEASONS)[number] | null => {
  if (typeof value !== "string") return null;
  const lower = value.toLowerCase();
  return SEASONS.includes(lower as (typeof SEASONS)[number]) ? (lower as (typeof SEASONS)[number]) : null;
};

const normaliseMonth = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

/**
 * Fetch all recipe entries sorted by newest first so downstream consumers can
 * safely slice without repeating the same sorting logic everywhere.
 */
export async function getSortedRecipes(): Promise<RecipeEntry[]> {
  const collection = await getCollection("recipes");
  return collection
    .slice()
    .sort((a, b) => toTimestamp(b.data.date) - toTimestamp(a.data.date));
}

export const mapToSummary = (entry: RecipeEntry): RecipeSummary => {
  const tags = Array.isArray(entry.data.tags) ? entry.data.tags.map(String) : [];

  return {
    slug: entry.slug,
    title: entry.data.title ?? entry.slug,
    tags,
    total: typeof entry.data.time?.total === "number" ? entry.data.time.total : null,
    date: entry.data.date ?? null,
    difficulty:
      entry.data.difficulty === "easy" ||
      entry.data.difficulty === "medium" ||
      entry.data.difficulty === "hard"
        ? entry.data.difficulty
        : null,
    image: entry.data.images?.[0]?.src ?? null,
    summary: (entry as unknown as { data?: { summary?: string } })?.data?.summary ?? null,
    featured: Boolean(entry.data.featured),
  };
};

export const mapAllToSummaries = (entries: RecipeEntry[]): RecipeSummary[] => entries.map(mapToSummary);

export const pickFeaturedRecipe = (entries: RecipeEntry[]): RecipeEntry | undefined =>
  entries.find((entry) => Boolean(entry.data.featured));

export const pickLatestRecipes = (entries: RecipeEntry[], limit = 6): RecipeEntry[] => entries.slice(0, limit);

export const resolveQuickTags = (
  entries: RecipeEntry[],
  preferred: readonly string[] = FALLBACK_TAGS
): string[] => {
  const available = new Set<string>();
  entries.forEach((entry) => {
    (entry.data.tags ?? []).forEach((tag) => available.add(String(tag)));
  });
  return preferred.filter((tag) => available.has(tag));
};

export const pickSeasonalRecipes = (
  entries: RecipeEntry[],
  now = new Date(),
  limit = 4
): RecipeEntry[] => {
  const month = now.getMonth() + 1;
  const season = SEASONS[Math.floor(((month - 1 + 12) % 12) / 3)];

  const seasonalMatches = entries.filter((entry) => {
    const entryMonth = normaliseMonth(entry.data.month);
    const entrySeason = normaliseSeason(entry.data.season);
    return entryMonth === month || entrySeason === season;
  });

  const source = seasonalMatches.length > 0 ? seasonalMatches : entries;
  return source.slice(0, limit);
};

export const collectTagCounts = (
  entries: RecipeEntry[],
  limit = 8
): Array<{ tag: string; count: number }> => {
  const counts = new Map<string, number>();
  entries.forEach((entry) => {
    (entry.data.tags ?? []).forEach((tag) => {
      const slug = String(tag);
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
};
