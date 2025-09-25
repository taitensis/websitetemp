# Nourriture Quotidienne

Astro-powered recipe collection that serves multi-lingual content with MDX, Tailwind CSS, and shadcn/ui components. This fork focuses on maintainable content pipelines, accessible filters, and fast static builds.

## Tech Stack

- **Astro** with static site generation and internationalised routing
- **React islands** for interactive experiences such as the recipe filters and navigation menus
- **shadcn/ui** component primitives styled with **Tailwind CSS v4**
- **MDX** content sourced from `src/content/recipes`

## Local Development

```bash
npm install
npm run dev
```

The dev server runs on [http://localhost:4321](http://localhost:4321). Astro reloads on content, layout, and translation changes.

## Useful Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the production build in `dist/` |
| `npm run preview` | Preview the built site locally |

## Project Structure

Key directories to be aware of:

```
src/
  components/       → React and Astro components (shadcn/ui based)
  content/          → MDX recipe entries and collection config
  layouts/          → Page shells and global theming helpers
  lib/              → Domain utilities (e.g. recipe data helpers)
  pages/            → Astro pages per locale and route
```

## Content Editing

Recipe entries live in `src/content/recipes`. Frontmatter powers the filters (time, difficulty, tags), while the body can use full MDX. When adding new tags, remember to provide translations in `src/i18n/tags` so they display nicely in every locale.

## Accessibility & Theming

- The theme toggle stores the preference in `localStorage` and respects the system default.
- Recipe filters expose semantic buttons and form controls so keyboard and assistive technology users can operate them.
- Colour tokens come from Tailwind CSS design tokens defined in `src/styles/global.css` and automatically support dark mode.

## Deployment

The project is configured to deploy to GitHub Pages under `https://taitensis.github.io/nourriture-quotidienne/`. Adjust the `site` and `base` values in `astro.config.mjs` if you publish elsewhere.
