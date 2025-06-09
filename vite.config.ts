import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom']
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
    chunkSizeWarningLimit: 500,
    // Enable source maps for production debugging
    sourcemap: false,
    // Minify for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
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