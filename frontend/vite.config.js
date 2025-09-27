
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['monaco-editor']
  },
  define: {
    global: 'globalThis',
  },
  worker: {
    format: 'es'
  }
})