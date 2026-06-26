import { defineConfig } from 'vite'
import { resolve } from 'path'
import { appendFileSync, cpSync, existsSync, mkdirSync } from 'fs'

function copyDir(src, dest) {
  if (!existsSync(src)) return
  mkdirSync(dest, { recursive: true })
  cpSync(src, dest, { recursive: true })
}

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function readJsonBody(req) {
  return new Promise((resolveBody, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      try {
        resolveBody(body ? JSON.parse(body) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function appendSubmission(type, payload) {
  const dir = resolve(__dirname, '.dev-submissions')
  mkdirSync(dir, { recursive: true })
  appendFileSync(
    resolve(dir, `${type}.jsonl`),
    JSON.stringify({ type, receivedAt: new Date().toISOString(), payload }) + '\n'
  )
}

async function forwardContactToBackend(payload) {
  const backendUrl = process.env.CONTACT_API_URL || 'http://localhost:3002/api/contact'
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20000)

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
    const text = await response.text()
    let data

    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = {
        success: false,
        message: `Backend returned an invalid response: ${text || response.statusText}`
      }
    }

    return { status: response.status, data }
  } catch (err) {
    return {
      status: 502,
      data: {
        success: false,
        message: err.name === 'AbortError'
          ? 'Backend contact email request timed out.'
          : `Backend contact email request failed: ${err.message}`
      }
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

function requireFields(payload, fieldMap) {
  return Object.entries(fieldMap)
    .filter(([field]) => !String(payload[field] || '').trim())
    .map(([field, message]) => ({ field, message }))
}

function validateContact(payload) {
  const errors = requireFields(payload, {
    fullName: 'Full name is required.',
    email: 'Email is required.',
    projectDetails: 'Message is required.'
  })

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push({ field: 'email', message: 'Enter a valid email address.' })
  }

  return errors
}

function validateReservation(payload) {
  const errors = requireFields(payload, {
    fullName: 'Full name is required.',
    mobile: 'Mobile number is required.',
    email: 'Email is required.',
    address: 'Address is required.',
    city: 'City is required.',
    state: 'State is required.',
    pin: 'PIN code is required.',
    farmId: 'Farm is required.',
    selectedPlan: 'Selected plan is required.'
  })

  if (payload.mobile && !/^[6-9]\d{9}$/.test(String(payload.mobile).replace(/\s/g, ''))) {
    errors.push({ field: 'mobile', message: 'Enter a valid 10-digit mobile number.' })
  }
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push({ field: 'email', message: 'Enter a valid email address.' })
  }
  if (payload.pin && !/^\d{6}$/.test(String(payload.pin))) {
    errors.push({ field: 'pin', message: 'Enter a valid 6-digit PIN code.' })
  }

  return errors
}

function createBookingId() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
  return `CHEDI-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export default defineConfig({
  plugins: [{
    name: 'local-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { success: false, message: 'Method not allowed.' })
          return
        }

        try {
          const payload = await readJsonBody(req)
          const errors = validateContact(payload)
          if (errors.length) {
            sendJson(res, 400, { success: false, errors })
            return
          }

          const result = await forwardContactToBackend(payload)
          sendJson(res, result.status, result.data)
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'Invalid request body.' })
        }
      })

      server.middlewares.use('/api/reservation', async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { success: false, message: 'Method not allowed.' })
          return
        }

        try {
          const payload = await readJsonBody(req)
          const errors = validateReservation(payload)
          if (errors.length) {
            sendJson(res, 400, { success: false, errors })
            return
          }

          const bookingId = createBookingId()
          const reservationDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })

          appendSubmission('reservation', { ...payload, bookingId, reservationDate })
          sendJson(res, 200, {
            success: true,
            bookingId,
            reservationDate,
            message: 'Reservation received.'
          })
        } catch (err) {
          sendJson(res, 400, { success: false, message: 'Invalid request body.' })
        }
      })
    }
  }, {
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
