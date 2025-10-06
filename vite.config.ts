import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com https://www.google.com https://www.gstatic.com; frame-src 'self' https://firebasestorage.googleapis.com; media-src 'self' https://firebasestorage.googleapis.com; object-src 'none'; img-src 'self' data: https://firebasestorage.googleapis.com;"
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/dashboard/find-cofounder/": path.resolve(__dirname, "./src/components/dashboard/find-cofounder"), // <-- This line was added
    },
  },
}));
