import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import { resolve } from 'path';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

export default defineConfig({
  plugins: [
    vue(),
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
    'process.env': process.env,
  },
});
