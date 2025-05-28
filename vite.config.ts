import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from "vite-plugin-pwa";
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "VibeLoop",
        short_name: "VibeLoop",
        start_url: ".",
        display: "standalone",
        background_color: "#0f172a",
        theme_color: "#0f172a",
        icons: [
          { src: "/icons/icon-192.png", sizes:"192x192", type:"image/png" },
          { src: "/icons/icon-512.png", sizes:"512x512", type:"image/png" }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /.*\.(mp3|ogg|aac)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "audio-cache",
              expiration: { maxEntries: 150, maxAgeSeconds: 60*60*24*30 }
            }
          }
        ]
      }
    }),
  ],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5000,      // You can change this port if needed
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0];
          }
          if (id.includes('firebase')) {
            return 'firebase-vendor';
          }
          if (id.includes('lucide-react')) {
            return 'lucide-vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
