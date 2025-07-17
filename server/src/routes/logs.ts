import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '../prisma'
import {
  LogEntryCreateInput,
  LogEntryUpdateInput,
  LogEntryQuery,
} from '../schemas/logEntrySchema'
import { z } from 'zod'

const logs = new Hono()

// GET /logs with optional status filter
logs.get('/', zValidator('query', LogEntryQuery), async (c) => {
  const { status = 'active' } = c.req.valid('query')

  const entries = await prisma.logEntry.findMany({
    where: { status },
    orderBy: { date: 'desc' },
    include: { tags: true },
  })

  const formatted = entries.map((log) => ({
    ...log,
    tags: log.tags.map((t) => t.name),
  }))

  return c.json(formatted)
})

// POST /logs
logs.post('/', zValidator('json', LogEntryCreateInput), async (c) => {
  const body = c.req.valid('json')

  const entry = await prisma.logEntry.create({
    data: {
      date: new Date(body.date),
      note: body.note,
      status: 'active',
      tags: {
        connectOrCreate: (body.tags || []).map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
      links: body.links || [],
    },
  })

  return c.json(entry)
})

// PATCH /logs/:id
logs.patch('/:id', zValidator('json', LogEntryUpdateInput), async (c) => {
  const id = c.req.param('id')
  const body = c.req.valid('json')

  const updated = await prisma.logEntry.update({
    where: { id },
    data: { status: body.status },
  })

  return c.json(updated)
})

export default logs
