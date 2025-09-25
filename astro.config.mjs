// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://taitensis.github.io/nourriture-quotidienne",
  base: "/nourriture-quotidienne/",

  integrations: [react(), mdx()],

  i18n: {
    locales: ["en", "fr", "es", "nl"],
    defaultLocale: "en",
    routing: {
      // prefixDefaultLocale: false, // default → /about and /fr/about
      // redirectToDefaultLocale: false, // keep "/" as default-locale home
    },
    // fallback: { fr: "en" }, // optional fallback
  }, // ← you were missing this closing brace

  vite: {
    plugins: [tailwindcss()],
  },
});
