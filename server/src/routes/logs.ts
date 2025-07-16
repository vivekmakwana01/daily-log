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
  const status = c.req.query('status') || 'active'
  
  const entries = await prisma.logEntry.findMany({
    where: { status },
    orderBy: { date: 'desc' },
    include: { tags: true }
  })

  const formatted = entries.map((log) => ({
    ...log,
    tags: log.tags.map((t) => t.name),
  }))

  return c.json(formatted)
})

logs.post('/', async (c) => {
  const body = await c.req.json()
  const data = LogSchema.parse(body)

  const tagNames = data.tags || []

  // Fetch existing tags
  const existingTags = await prisma.tag.findMany({
    where: { name: { in: tagNames } },
  })

  const existingNames = new Set(existingTags.map((t) => t.name))

  // Create new tags if needed
  const newTags = await Promise.all(
    tagNames
      .filter((name) => !existingNames.has(name))
      .map((name) => prisma.tag.create({ data: { name } }))
  )

  const allTags = [...existingTags, ...newTags]

  const log = await prisma.logEntry.create({
    data: {
      note: data.note,
      date: new Date(data.date),
      links: data.links ?? [],
      tags: {
        connect: allTags.map((t) => ({ id: t.id })),
      },
    },
    include: { tags: true },
  })

  return c.json({
    ...log,
    tags: log.tags.map((t) => t.name),
  })
})

logs.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()

  const schema = z.object({
    status: z.enum(['active', 'deleted'])
  })

  const parse = schema.safeParse(body)
  if (!parse.success) {
    return c.json({ error: 'Invalid request body' }, 400)
  }

  const updated = await prisma.logEntry.update({
    where: { id },
    data: { status: parse.data.status }
  })

  return c.json(updated)
})

export default logs
