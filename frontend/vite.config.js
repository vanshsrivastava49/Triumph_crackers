import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",          // Specify the root folder
  build: {
    outDir: "dist",    // Output folder for build
  },
  server: {
    port: 5173,        // Development server port
    open: true,        // Auto-open in browser
  }
});
