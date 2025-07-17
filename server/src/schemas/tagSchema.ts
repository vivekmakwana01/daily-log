import { z } from 'zod'

export const TagCreateInput = z.object({
  name: z.string().min(1)
})

export const TagQuery = z.object({
  q: z.string().optional()
})

export type TagCreateInputType = z.infer<typeof TagCreateInput>
export type TagQueryType = z.infer<typeof TagQuery>
