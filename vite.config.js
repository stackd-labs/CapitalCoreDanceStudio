import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Dev only: serve the Vercel functions in /api from the Vite dev server so forms that
// post to /api/notify work on localhost. Not part of the production build.
function devApi(env) {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, env)
      server.middlewares.use('/api/notify', (req, res) => {
        let raw = ''
        req.on('data', (c) => { raw += c })
        req.on('end', async () => {
          try { req.body = raw ? JSON.parse(raw) : {} } catch { req.body = null }
          res.status = (c) => { res.statusCode = c; return res }
          res.json = (o) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)) }
          try {
            const mod = await server.ssrLoadModule('/api/notify.js')
            await mod.default(req, res)
          } catch (e) {
            console.error(e)
            res.statusCode = 500
            res.end('{"error":"dev api error"}')
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), devApi(loadEnv(mode, process.cwd(), ''))],
  // Bind IPv4 loopback explicitly: the default resolved to IPv6-only (::1) here and the
  // browser could not connect. Local machine only, not exposed to the network.
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
}))
