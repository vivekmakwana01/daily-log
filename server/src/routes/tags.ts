import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { prisma } from '../prisma'
import { TagCreateInput, TagQuery } from '../schemas/tagSchema'

const tags = new Hono()

// GET /tags?q=search
tags.get('/', zValidator('query', TagQuery), async (c) => {
  const { q } = c.req.valid('query')

  const results = await prisma.tag.findMany({
    where: q ? { name: { contains: q, mode: 'insensitive' } } : undefined,
    orderBy: { name: 'asc' },
  })

  return c.json(results.map((t) => t.name))
})

// POST /tags
tags.post('/', zValidator('json', TagCreateInput), async (c) => {
  const { name } = c.req.valid('json')

  const tag = await prisma.tag.upsert({
    where: { name },
    create: { name },
    update: {},
  })

  return c.json(tag)
})

export default tags
