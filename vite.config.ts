import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    minify: "terser",
    target: "ESNext",
    commonjsOptions: {
      ignoreDynamicRequires: true,
    },
    manifest: true,
  },
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
