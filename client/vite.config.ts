import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const rootDir = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: '../API/wwwroot',
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: [
      {
        find: 'src',
        replacement: resolve(rootDir, 'src'),
      },
      {
        find: /^zod$/,
        replacement: resolve(rootDir, 'src/lib/zod-compat.ts'),
      },
      {
        find: 'zod-actual',
        replacement: resolve(rootDir, 'node_modules/zod'),
      },
    ],
  },
  plugins: [react(), mkcert()],
})
