// src/components/RecipesFilters.tsx
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

type Translate = (k: string, params?: Record<string, unknown>) => string;
type SortKey = 'newest' | 'oldest' | 'fastest' | 'longest';

type Props = {
  t: Translate;
  allTags: string[];
  tTag: (slug: string) => string;

  query: string;
  setQuery: (v: string) => void;

  sort: SortKey;
  setSort: (v: SortKey) => void;

  activeTags: Set<string>;
  toggleTag: (tag: string) => void;

  difficulties: Set<string>;
  toggleDifficulty: (d: string) => void;

  reset: () => void;
};

export default function RecipesFilters({
  t,
  allTags,
  tTag,
  query,
  setQuery,
  sort,
  setSort,
  activeTags,
  toggleTag,
  difficulties,
  toggleDifficulty,
  reset,
}: Props) {
  return (
    <Card className="border-border gap-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('search.filter_recipes')}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('search.search')}</label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.title_or_tag')}
              aria-label={t('search.title_or_tag')}
              autoComplete="off"
            />
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('search.sort')}</label>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('search.sort_newest')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('search.sort_newest')}</SelectItem>
                <SelectItem value="oldest">{t('search.sort_oldest')}</SelectItem>
                <SelectItem value="fastest">{t('search.fastest')}</SelectItem>
                <SelectItem value="longest">{t('search.longest')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('search.difficulty')}</label>
            <ToggleGroup type="multiple" className="justify-start">
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <ToggleGroupItem
                  key={d}
                  value={d}
                  aria-label={t(`difficulty.${d}`)}
                  data-state={difficulties.has(d) ? 'on' : 'off'}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDifficulty(d);
                  }}
                  type="button"
                  className="capitalize"
                >
                  {t(`difficulty.${d}`)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        <Separator />

        {/* Tags */}
        {allTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const active = activeTags.has(tag);
              return (
                <Badge
                  key={tag}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleTag(tag);
                  }}
                  className={`cursor-pointer select-none ${active ? '' : 'opacity-60 hover:opacity-100'}`}
                  variant={active ? 'default' : 'secondary'}
                >
                  {tTag(tag)}
                </Badge>
              );
            })}
          </div>
        ) : (
          <span className="text-sm opacity-70">{t('search.no_tags_yet')}</span>
        )}

        {(activeTags.size > 0 || difficulties.size > 0 || query) && (
          <div>
            <Button variant="outline" size="sm" onClick={reset}>
              {t('search.reset_filters')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
