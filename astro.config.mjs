// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://taitensis.github.io/nourriture-quotidienne",
  base: "/nourriture-quotidienne/",

  integrations: [
    react(),
    mdx({
      // Add MDX configuration for better syntax highlighting
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "github-dark",
      },
    }),
  ],

  i18n: {
    locales: ["en", "fr", "es", "nl"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false, // This allows /about instead of /en/about
      redirectToDefaultLocale: false,
    },
    fallback: {
      fr: "en",
      es: "en",
      nl: "en",
    },
  },

  vite: {
    plugins: [tailwindcss()],
    // Add optimizations
    ssr: {
      noExternal: ["@radix-ui/*"],
    },
  },

  // Add build optimizations
  build: {
    inlineStylesheets: "auto",
  },

  // Add prefetch for better performance
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  // Security headers
  security: {
    checkOrigin: true,
  },
});
