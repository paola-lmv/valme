import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/valme/', // Remplace "ton-repo" par le nom de ton dépôt GitHub

})
