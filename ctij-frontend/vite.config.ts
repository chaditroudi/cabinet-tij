import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      crypto: 'crypto-browserify',

    },
    },
  build: {
    outDir: "dist", // Ensure this points to the correct build directory
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["localhost", "127.0.0.1", "0.0.0.0"],
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: false,
    },
    fs: {
      allow: ["."],
      strict: false,
    },
  },
  optimizeDeps: {
    exclude: [".git"],
  },
});
