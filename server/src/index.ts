import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse } from 'shared/dist'
import logs from './routes/logs'
import { serve } from 'bun'

const app = new Hono()

app.use(cors())

app.route('/api/logs', logs)

serve({ fetch: app.fetch, port: 3000 })