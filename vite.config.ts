import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VueMcp } from 'vite-plugin-vue-mcp'
import vueDevTools from 'vite-plugin-vue-devtools'
import watchQuestionsPlugin from './scripts/vite-plugin-watch-questions'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), VueMcp(), vueDevTools(), watchQuestionsPlugin()],
  server: {
    port: 5174,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
