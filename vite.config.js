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
  server: {
    historyApiFallback: true,
  },
  
})
