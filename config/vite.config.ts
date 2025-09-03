import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, '..'),
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js')
  },
  server: {
    port: 3000,
    open: true
  }
})
