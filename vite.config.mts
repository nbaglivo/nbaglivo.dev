import { defineConfig } from 'vite'
import { join } from 'node:path'
import { staticSitePlugin } from './build/site-plugin.mjs'

export default defineConfig({
  publicDir: false,
  build: {
    rollupOptions: {
      input: 'build/noop-entry.mjs',
    },
  },
  plugins: [
    staticSitePlugin({
      rootDir: import.meta.dirname,
      outDir: join(import.meta.dirname, 'dist'),
    }),
  ],
})
