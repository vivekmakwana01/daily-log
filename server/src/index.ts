import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from 'bun'
import logs from './routes/logs'
import tags from './routes/tags'

const app = new Hono()

app.use(cors())

app.route('/api/logs', logs)
app.route('/api/tags', tags)

serve({ fetch: app.fetch, port: 3000 })