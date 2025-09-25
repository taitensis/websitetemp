// src/i18n/ingredients.ts
import { DEFAULT_LOCALE, type Locale, makeTranslator, makeT as coreMakeT } from './core';

const base = {
  to_taste: 'to taste',
  optional: 'optional',
  divided: 'divided',
  plus_more: 'plus more for serving',
  pinch: 'pinch',
  handful: 'handful',
  tsp: 'tsp',
  tbsp: 'tbsp',
  cup: 'cup',
  g: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
} as const;

export type IngredientStrings = typeof base; // ← add this

export const dicts: Partial<Record<Locale, Partial<IngredientStrings>>> = {
  en: base,
  fr: {
    to_taste: 'selon le goût',
    optional: 'facultatif',
    divided: 'divisé',
    plus_more: 'et un peu plus pour servir',
    pinch: 'pincée',
    handful: 'poignée',
    tsp: 'càc',
    tbsp: 'càs',
    cup: 'tasse',
  },
  es: {
    to_taste: 'al gusto',
    optional: 'opcional',
    divided: 'dividido',
    plus_more: 'más para servir',
    pinch: 'pizca',
    handful: 'puñado',
    tsp: 'cdta',
    tbsp: 'cda',
    cup: 'taza',
  },
  nl: {
    to_taste: 'naar smaak',
    optional: 'optioneel',
    divided: 'gedeeld',
    plus_more: 'plus extra voor serveren',
    pinch: 'snufje',
    handful: 'handvol',
    tsp: 'tl',
    tbsp: 'el',
    cup: 'kop',
  },
};

const _t = makeTranslator(base, dicts, DEFAULT_LOCALE);
export const t = _t; // one-off: t(locale, "key", params)
export const makeT = (loc?: Locale) => coreMakeT(_t)(loc);
export const useT = makeT; // alias, so both imports work
