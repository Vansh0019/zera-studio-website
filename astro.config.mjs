import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://zera-ai.com",
  devToolbar: {
    enabled: false
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false
    }),
    sitemap()
  ],
  output: "static"
});
