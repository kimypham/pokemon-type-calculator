import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  cacheDir: "../node_modules/.vite",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
