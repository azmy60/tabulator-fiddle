import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    cors: {
      // The sandboxed preview iframe has a "null" origin and loads Tabulator
      // as a module, which needs CORS.
      origin: [/^https?:\/\/localhost(:\d+)?$/, "null"],
    },
    fs: {
      // tabulator-tables is linked to ../tabulator, outside this project.
      allow: [".", "../tabulator"],
    },
  },
});
