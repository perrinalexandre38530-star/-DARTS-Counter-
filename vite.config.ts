import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',              // important sur Pages
  build: {
    outDir: 'dist'        // Cloudflare Pages attend 'dist'
  }
})
