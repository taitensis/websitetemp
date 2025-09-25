// src/i18n/tags.ts
import { DEFAULT_LOCALE, type Locale, makeTranslator, makeT as coreMakeT } from './core';

const base = {
  asian: 'Asian',
  european: 'European',
  american: 'American',
  mediterranean: 'Mediterranean',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  dessert: 'Dessert',
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
  drink: 'Drink',
  side: 'Side',
} as const;

export type TagStrings = typeof base; // ← add this

export const dicts: Partial<Record<Locale, Partial<TagStrings>>> = {
  en: base,
  fr: {
    asian: 'Asiatique',
    european: 'Européen',
    american: 'Américain',
    mediterranean: 'Méditerranéen',
    vegetarian: 'Végétarien',
    vegan: 'Végane',
    breakfast: 'Petit-déjeuner',
    drink: 'Boisson',
    side: 'Accompagnement',
  },
  es: {
    asian: 'Asiática',
    european: 'Europea',
    american: 'Estadounidense',
    mediterranean: 'Mediterránea',
    vegetarian: 'Vegetariana',
    vegan: 'Vegana',
    breakfast: 'Desayuno',
    lunch: 'Almuerzo',
    dinner: 'Cena',
    snack: 'Tentempié',
    drink: 'Bebida',
    side: 'Guarnición',
  },
  nl: {
    asian: 'Aziatisch',
    european: 'Europees',
    american: 'Amerikaans',
    mediterranean: 'Mediterrane',
    vegetarian: 'Vegetarisch',
    vegan: 'Veganistisch',
    dessert: 'Nagerecht',
    breakfast: 'Ontbijt',
    dinner: 'Diner',
    drink: 'Drank',
    side: 'Bijgerecht',
  },
};

const _t = makeTranslator(base, dicts, DEFAULT_LOCALE);
export const t = _t; // one-off: t(locale, "key", params)
export const makeT = (loc?: Locale) => coreMakeT(_t)(loc);
export const useT = makeT; // alias, so both imports work
