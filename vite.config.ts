import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for large dependencies
          vendor: ['react', 'react-dom'],
          // Router chunk
          router: ['react-router-dom'],
          // Supabase chunk
          supabase: ['@supabase/supabase-js'],
          // UI chunk
          ui: ['lucide-react']
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: true
  },
  // Performance optimizations
  server: {
    // Enable HTTP/2
    https: false,
    // Optimize dev server
    hmr: {
      overlay: false
    }
  }
});