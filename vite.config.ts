import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 4000,
    proxy: {
      // mirrors the Vercel rewrite in vercel.json (download fallback)
      "/tmdb-image": {
        target: "https://image.tmdb.org",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/tmdb-image/, "/t/p"),
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    minify: "terser",
    target: "es2020",
    rollupOptions: {
      output: {
        // stable vendor chunks cache well between deploys
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          query: ["@tanstack/react-query", "axios"],
          radix: ["@radix-ui/react-dialog", "@radix-ui/react-tabs"],
        },
      },
    },
  },
  plugins: [react(), tsconfigPaths()],
});
