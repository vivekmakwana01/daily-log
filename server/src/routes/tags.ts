import { Hono } from 'hono'
import { prisma } from '../prisma'

const tags = new Hono()

// GET /api/tags?search=bug
tags.get('/', async (c) => {
  const search = c.req.query('search') || ''

  const result = await prisma.tag.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
    orderBy: { name: 'asc' },
    take: 20,
  })

  return c.json(result.map(tag => tag.name))
})

export default tags
