// src/components/RecipesGrid.tsx
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RecipeItem } from '@/components/RecipesIndex';

type Translate = (k: string, params?: Record<string, unknown>) => string;
type TTag = (slug: string) => string;

const join = (a?: string, b?: string) => {
  const left = (a ?? '').replace(/\/+$/, '');
  const right = (b ?? '').replace(/^\/+/, '');
  return [left, right].filter(Boolean).join('/');
};
const withBase = (p: string) => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const abs = p.startsWith('/') ? p : `/${p}`;
  return abs.startsWith(`${base}/`) ? abs : `${base}${abs}`;
};

export default function RecipesGrid({
  items,
  t,
  tTag,
  localePrefix,
}: {
  items: RecipeItem[];
  t: Translate;
  tTag: TTag;
  localePrefix: string;
}) {
  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center opacity-70">{t('search.no_results')}</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const href = item.slug ? join(localePrefix, `/${item.slug}`) : localePrefix || '/';
        const imgSrc = item.image
          ? item.image.startsWith('/') ? join(withBase(''), item.image) : item.image
          : null;

        return (
          <Card
            key={item.slug}
            className="group overflow-hidden border border-border/60 bg-card/60
                       px-3 py-3 shadow-sm transition-colors transition-shadow duration-200
                       hover:border-border hover:bg-card hover:shadow-md"
          >
            {imgSrc && (
              <a href={href} className="block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:brightness-105"
                    loading="lazy"
                  />
                </div>
              </a>
            )}

            <CardContent className="space-y-3 p-4">
              <a href={href} className="block hover:no-underline">
                <h3 className="line-clamp-2 font-semibold leading-tight hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </a>

              <div className="flex flex-wrap gap-2">
                {item.tags?.slice(0, 3).map((slug) => (
                  <Badge key={String(slug)} variant="secondary">
                    {tTag(String(slug))}
                  </Badge>
                ))}
                {item.total != null && <Badge variant="outline">{item.total} min</Badge>}
                {item.difficulty && (
                  <Badge variant="outline" className="capitalize">
                    {t(`difficulty.${item.difficulty}`)}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
