import { defineConfig } from 'vite'
import { resolve } from 'path'
import { cpSync, existsSync, mkdirSync } from 'fs'

function copyDir(src, dest) {
  if (!existsSync(src)) return
  mkdirSync(dest, { recursive: true })
  cpSync(src, dest, { recursive: true })
}

export default defineConfig({
  // Dev server: proxy /api/* calls to the Express backend so no hardcoded URLs
  // or CORS issues during development.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        timeout: 60000,
        proxyTimeout: 60000
      }
    }
  },

  plugins: [{
    name: 'project-details-history-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = req.url.split('?')[0]
        if (req.url && (/^\/project-details\//.test(path) || /^\/farm-listing\//.test(path) || path === '/terms-and-conditions' || path === '/privacy-policy')) {
          req.url = '/main.html'
        }
        next()
      })
    }
  }, {
    name: 'copy-static-assets',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      copyDir(resolve(__dirname, 'css'), resolve(dist, 'css'))
      copyDir(resolve(__dirname, 'js'), resolve(dist, 'js'))
    }
  }, {
    name: 'preserve-responsive-css-link',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (html.includes('responsive.css')) return html
        return html.replace(
          '</body>',
          '  <link rel="stylesheet" href="/css/responsive.css">\n</body>'
        )
      }
    }
  }],

  // Build: include all HTML entry points so Vite copies them to dist/
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        main: resolve(__dirname, 'main.html'),
        ref: resolve(__dirname, 'ref.html')
      }
    }
  }
})
