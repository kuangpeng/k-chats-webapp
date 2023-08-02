import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import debug from 'vite-plugin-debug'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 4000
  },
  plugins: [
    vue(),
    UnoCSS({
      configFile: './uno.config.js'
    }),
    debug(),
    Components(),
    AutoImport({
      imports: ['vue', 'vitest'],
      eslintrc: {
        // enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    enviroment: 'jsdom'
  }
})
