import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js']
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
        },
        // Optimize chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: false, // Disable in production for smaller builds
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    // Target modern browsers for smaller bundles
    target: 'es2020'
  },
  // Performance optimizations
  server: {
    // Enable HTTP/2
    https: false,
    // Optimize dev server
    hmr: {
      overlay: false
    },
    // Enable compression
    middlewareMode: false
  },
  // CSS optimization
  css: {
    devSourcemap: false,
    postcss: {
      plugins: []
    }
  },
  // Enable experimental features for better performance
  esbuild: {
    // Remove console.logs in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    // Enable tree shaking
    treeShaking: true
  }
});