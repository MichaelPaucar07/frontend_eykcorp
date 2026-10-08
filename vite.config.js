import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Puerto fijo: el backend solo permite CORS desde este origen.
  // Con strictPort, si el puerto está ocupado Vite falla en lugar de usar otro.
  server: {
    port: 5173,
    strictPort: true,
  },
})
