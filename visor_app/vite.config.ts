import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Ajuste para GitHub Pages: base desde env VITE_BASE (p.ej. "/repo/") o "/" en local
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
