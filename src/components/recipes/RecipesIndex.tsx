import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { makeT as makeUiT } from '@/i18n/ui';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/core';
import { makeT as makeTagsT } from '@/i18n/tags';
import type { RecipeSummary } from '@/lib/recipes';

type Tt = (key: string, params?: Record<string, unknown>) => string;
type TtTag = (key: string, params?: Record<string, unknown>) => string;

export type RecipeItem = RecipeSummary;

type Props = {
  items: RecipeItem[];
  locale?: Locale;
  localePrefix?: string;
};

const SORT_OPTIONS = [
  { value: 'newest', labelKey: 'sort_newest' },
  { value: 'oldest', labelKey: 'sort_oldest' },
  { value: 'fastest', labelKey: 'fastest' },
  { value: 'longest', labelKey: 'longest' },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]['value'];
type SortLabelKey = (typeof SORT_OPTIONS)[number]['labelKey'];

const withBase = (p: string) => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const abs = p.startsWith('/') ? p : `/${p}`;
  return abs.startsWith(`${base}/`) ? abs : `${base}${abs}`;
};

const join = (a: string, b: string) => `${a.replace(/\/+$/, '')}/${b.replace(/^\/+/, '')}`;

export default function RecipesIndex({ items, locale, localePrefix }: Props) {
  const tt = React.useMemo<Tt>(() => makeUiT(locale ?? DEFAULT_LOCALE), [locale]);
  const ttTagRaw = React.useMemo<TtTag>(() => makeTagsT(locale ?? DEFAULT_LOCALE), [locale]);
  const hrefPrefix = React.useMemo(
    () => (localePrefix != null ? localePrefix : withBase('/')),
    [localePrefix]
  );

  // We want a resilient lookup because CMS authors sometimes publish tags
  // before adding translations. Falling back to the raw slug keeps the UI usable.
  const tTagSafe = React.useCallback(
    (slug: string) => {
      try {
        return ttTagRaw(slug);
      } catch {
        return slug;
      }
    },
    [ttTagRaw]
  );

  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState<SortKey>('newest');
  const [activeTags, setActiveTags] = React.useState<Set<string>>(new Set());
  const [difficulties, setDifficulties] = React.useState<Set<string>>(new Set());

  const allTags = React.useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => i.tags?.forEach((t) => s.add(t)));
    const arr = Array.from(s);
    return arr.sort((a, b) => tTagSafe(a).localeCompare(tTagSafe(b)));
  }, [items, tTagSafe]);

  const toggleTag = React.useCallback((tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }, []);

  const handleDifficultyChange = React.useCallback((values: string[]) => {
    setDifficulties(new Set(values));
  }, []);

  const filtered = React.useMemo(() => {
    const toMs = (d: unknown) =>
      typeof d === 'string' ? Date.parse(d) : d instanceof Date ? d.getTime() : 0;

    const fold = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');

    const q = fold(query.trim());

    let out = items.filter((i) => {
      const title = fold(i.title);
      const tagLabels = (i.tags || []).map((t) => fold(tTagSafe(t)));
      // Check the normalized title and tag labels against the current search query.
      const matchesQuery = !q || title.includes(q) || tagLabels.some((t) => t.includes(q));
      // Keep recipes that match at least one selected tag (if any are active).
      const matchesTags = activeTags.size === 0 || (i.tags || []).some((t) => activeTags.has(t));
      // Only allow recipes with the chosen difficulty levels.
      const matchesDiff =
        difficulties.size === 0 || (i.difficulty && difficulties.has(i.difficulty));
      return matchesQuery && matchesTags && matchesDiff;
    });

    out.sort((a, b) => {
      // Sort recipes by date or duration depending on the chosen option.
      if (sort === 'newest') {
        const bDate = toMs(b.date);
        const aDate = toMs(a.date);
        return bDate - aDate;
      }
      if (sort === 'oldest') {
        const aDate = toMs(a.date);
        const bDate = toMs(b.date);
        return aDate - bDate;
      }
      if (sort === 'fastest') return (a.total ?? Infinity) - (b.total ?? Infinity);
      if (sort === 'longest') return (b.total ?? -1) - (a.total ?? -1);
      return 0;
    });

    return out;
  }, [items, query, activeTags, difficulties, sort, tTagSafe]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="border-border gap-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{tt('filter_recipes')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">{tt('search')}</label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tt('title_or_tag')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{tt('sort')}</label>
              <Select value={sort} onValueChange={(v: any) => setSort(v as SortKey)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={tt('sort_newest')} />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {tt(opt.labelKey as SortLabelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{tt('difficulty')}</label>
              <ToggleGroup
                type="multiple"
                className="justify-start"
                value={Array.from(difficulties)}
                onValueChange={handleDifficultyChange}
              >
                {['easy', 'medium', 'hard'].map((d) => (
                  <ToggleGroupItem key={d} value={d} aria-label={tt(d)} className="capitalize">
                    {tt(d)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            {/* Render tags as real buttons so keyboard users can toggle filters. */}
            {allTags.map((tag) => (
              <Badge
                key={tag}
                asChild
                className={`cursor-pointer select-none transition ${
                  activeTags.has(tag) ? '' : 'opacity-80 hover:opacity-100'
                }`}
                variant={activeTags.has(tag) ? 'default' : 'secondary'}
              >
                <button
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={activeTags.has(tag)}
                  className="inline-flex items-center gap-1"
                >
                  {tTagSafe(tag)}
                </button>
              </Badge>
            ))}
            {allTags.length === 0 && (
              <span className="text-sm text-muted-foreground">{tt('no_tags_yet')}</span>
            )}
          </div>

          {(activeTags.size > 0 || difficulties.size > 0 || query) && (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setSort('newest');
                  setActiveTags(new Set());
                  setDifficulties(new Set());
                }}
              >
                {tt?.('reset_filters') ?? 'Reset filters'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState tt={tt} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <RecipeCard key={r.slug} item={r} ttTag={tTagSafe} localePrefix={hrefPrefix} />
          ))}
        </div>
      )}
    </div>
  );
}

  // Present each recipe with consistent styling and shared locale-aware links.
  function RecipeCard({
  item,
  ttTag,
  localePrefix,
}: {
  item: RecipeItem;
  ttTag: TtTag;
  localePrefix: string;
}) {
  const base = import.meta.env.BASE_URL; // for images
  const href = join(localePrefix, `recipes/${item.slug}`); // locale + base aware

  const imgSrc = item.image
    ? item.image.startsWith('/')
      ? join(base, item.image) // avoid double slashes
      : item.image
    : null;

  return (
    <Card
      className="hover:border-ring hover:ring-ring/50 group overflow-hidden border border-slate-200 px-3
                 py-3 transition-[color,box-shadow] hover:ring-[3px] dark:border-slate-800"
    >
      {imgSrc && (
        <a href={href} className="block">
          <div className="relative aspect-[4/3]">
            <img
              src={imgSrc}
              alt={item.title}
              className="absolute inset-0 block h-full w-full object-cover transition duration-300 group-hover:brightness-105"
              loading="lazy"
            />
          </div>
        </a>
      )}
      <CardContent className="space-y-3 p-4">
        <a href={href} className="block">
          <h3 className="line-clamp-2 font-semibold leading-tight">{item.title}</h3>
        </a>
        <div className="flex flex-wrap gap-2">
          {item.tags?.slice(0, 3).map((t) => (
            <Badge key={t} variant="secondary">
              {ttTag(t)}
            </Badge>
          ))}
          {item.total != null && <Badge variant="outline">{item.total} min</Badge>}
          {item.difficulty && (
            <Badge variant="outline" className="capitalize">
              {item.difficulty}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

  // Friendly empty state keeps the layout stable when no matches are found.
  function EmptyState({ tt }: { tt: Tt }) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-8 text-center text-slate-500">{tt('no_results')}</CardContent>
    </Card>
  );
}
