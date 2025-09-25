import { DEFAULT_LOCALE, type Locale, makeTranslator, makeT as coreMakeT } from './core';

const base = {
  hi: 'Hey!',
  welcome_message:
    'I’m Maxime, and this site is where I keep my recipes and share them. It’s no five-star restaurant, just everyday cooking. Feel free to try them out and let me discover yours. Enjoy your meal! (…and watch out: your stomach might start growling!)',
  home: 'Home',
  recipes: 'Recipes',
  about: 'About',
} as const;

export type UiStrings = typeof base;

const dicts: Partial<Record<Locale, Partial<UiStrings>>> = {
  en: base,
  fr: {
    hi: 'Coucou !',
    welcome_message:
      "Moi c’est Maxime et ce site me permet de conserver mes recettes et de les partager. Ce n’est pas un cinq étoiles, juste des recettes du quotidien. N'hésitez pas à les essayer et à me faire découvrir les vôtres. Bon ap' ! (et attention, votre estomac risque de gargouiller !)",
    home: 'Accueil',
    recipes: 'Recettes',
    about: 'À propos',
  },
  es: {
    hi: '¡Hola!',
    welcome_message:
      'Soy Maxime y aquí guardo mis recetas y las comparto. No es un cinco estrellas, sólo recetas del día a día. Anímate a probarlas y a hacerme descubrir las tuyas. ¡Buen provecho! (y cuidado, ¡puede que salgas con hambre!)',
    home: 'Inicio',
    recipes: 'Recetas',
    about: 'Acerca de mí',
  },
  nl: {
    hi: 'Hey!',
    welcome_message:
      'Ik ben Maxime en hier bewaar ik mijn recepten en deel ik ze. Geen vijfsterrenrestaurant, gewoon alledaagse gerechten. Probeer ze gerust en laat mij de jouwe ontdekken. Smakelijk! (…en pas op: je krijgt er misschien honger van!)',
    home: 'Home',
    recipes: 'Recepten',
    about: 'Over mij',
  },
};

const _t = makeTranslator(base, dicts, DEFAULT_LOCALE);
export const t = _t; // one-off: t(locale, "key", params)
export const makeT = (loc?: Locale) => coreMakeT(_t)(loc);
export const useT = makeT; // alias, so both imports work
