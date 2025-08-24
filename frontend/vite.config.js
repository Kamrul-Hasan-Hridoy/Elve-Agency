import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
  server: {
    proxy: {
      // Proxy API requests
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      // Proxy image requests
      "/images": {
        target: "http://localhost:5001/static/images",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/images/, ""), 
      },
    },
  },
});
