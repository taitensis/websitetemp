// src/i18n/core.ts
export const locales = ['en', 'fr', 'es', 'nl'] as const;
export type Locale = (typeof locales)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export type DictBase = Record<string, string>;

/** Build a translator from base strings + per-locale overrides */
export function makeTranslator<TBase extends DictBase>(
  base: TBase,
  dicts: Partial<Record<Locale, Partial<TBase>>>,
  defaultLocale: Locale = DEFAULT_LOCALE
) {
  return function t(
    locale: Locale | undefined,
    key: keyof TBase,
    params: Record<string, unknown> = {}
  ): string {
    const loc = (locale ?? defaultLocale) as Locale;
    const templateRaw = dicts[loc]?.[key] ?? base[key];
    if (typeof templateRaw !== 'string') {
      throw new Error(`i18n: Missing string for key "${String(key)}" in locale "${loc}".`);
    }
    const template = templateRaw as string;

    const count =
      typeof params.count === 'number'
        ? params.count
        : Number.isFinite(Number(params.count))
          ? Number(params.count)
          : undefined;

    // placeholders + simple {one|other} plural
    return template.replace(/\{([^}]+)\}/g, (_m, expr) => {
      if (expr.includes('|')) {
        const [one, other] = expr.split('|');
        return count === 1 ? one : (other ?? one);
      }
      return String(params[expr] ?? '');
    });
  };
}

/** Helper so pages can do: const tt = useT(t, locale); then tt('key') */
export function useT<TBase extends DictBase>(
  t: ReturnType<typeof makeTranslator<TBase>>,
  locale: Locale | undefined
) {
  return (key: keyof TBase, params?: Record<string, unknown>) => t(locale, key, params ?? {});
}

export function makeT<TBase extends DictBase>(t: ReturnType<typeof makeTranslator<TBase>>) {
  return (locale: Locale | undefined) => (key: keyof TBase, params?: Record<string, unknown>) =>
    t(locale, key, params ?? {});
}
