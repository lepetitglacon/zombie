import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'fix-recast',
      transform(code, id) {
        if (id.includes('recast-detour.js')) {
          return code.replace(`this["Recast"]`, 'window["Recast"]');
        }
      }
    },
    vue(),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
