import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../prisma'

const logs = new Hono()

const LogSchema = z.object({
  note: z.string(),
  tags: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  date: z.string()
})

logs.get('/', async (c) => {
  const entries = await prisma.logEntry.findMany({ orderBy: { date: 'desc' } })
  return c.json(entries)
})

logs.post('/', async (c) => {
  const body = await c.req.json()
  const data = LogSchema.parse(body)
  const entry = await prisma.logEntry.create({ data })
  return c.json(entry)
})

export default logs
