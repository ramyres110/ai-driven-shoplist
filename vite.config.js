import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Gera os ícones PNG (192/512/maskable/apple-touch) a partir do SVG
      pwaAssets: {
        preset: 'minimal-2023',
        image: 'public/favicon.svg',
      },
      manifest: {
        name: 'Lista de Compras',
        short_name: 'Compras',
        description: 'Monte sua lista, marque o que comprou e saiba o total antes do caixa.',
        lang: 'pt-BR',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
})
