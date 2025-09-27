import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [
    react(),
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: { theme: "github-dark" },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: { noExternal: ["@radix-ui/*"] },
  },

  build: { inlineStylesheets: "auto" },
  prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
  security: { checkOrigin: true },
});