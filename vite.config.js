import vue from "@vitejs/plugin-vue";
import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import vueDevTools from "vite-plugin-vue-devtools";

dotenv.config();

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    electron({
      entry: "electron/main.cjs",
    }),
  ],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  optimizeDeps: {
    exclude: ["@electron/remote"],
  },
  define: {
    "process.env.NODE_ENV": '"development"',
    "process.env": process.env,
  },
});
