import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@fortawesome/fontawesome-svg-core': '@fortawesome/fontawesome-svg-core',
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React into its own chunk
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Split animations
          'vendor-motion': ['framer-motion'],
          // Split Supabase
          'vendor-supabase': ['@supabase/supabase-js'],
          // Split icons
          'vendor-icons': [
            'lucide-react',
            '@fortawesome/react-fontawesome',
            '@fortawesome/free-solid-svg-icons',
          ],
        },
      },
    },
  },
  server: {
    historyApiFallback: true,
  },
  
})
