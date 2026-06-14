import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const brandingJsonPath = resolve(__dirname, 'src/assets/branding.json')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-branding-json',
      // dev: /branding.json をミドルウェアで返す
      configureServer(server) {
        server.middlewares.use('/branding.json', (_req, res) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(readFileSync(brandingJsonPath))
        })
      },
      // prod: dist/branding.json としてコピー出力
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'branding.json',
          source: readFileSync(brandingJsonPath, 'utf-8'),
        })
      },
    },
  ],
})
