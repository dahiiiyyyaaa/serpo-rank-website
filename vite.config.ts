import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  resolve: {
    alias: { "@": resolve(process.cwd(), "src") },
    dedupe: ["react", "react-dom", "@tanstack/react-query"],
    tsconfigPaths: true,
  },
  css: { transformer: "lightningcss" },
  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: true,
        crawlLinks: true,
        failOnError: true,
      },
    }),
    nitro(),
    viteReact(),
  ],
});
