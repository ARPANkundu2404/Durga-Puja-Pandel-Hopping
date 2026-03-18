import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Fallback to index.html for SPA routing in development
    middlewareMode: false,
  },
  build: {
    // Optimize build for production
    outDir: "dist",
    sourcemap: false,
  },
  preview: {
    // Ensure proper serving in production preview
    port: 4173,
  },
});
