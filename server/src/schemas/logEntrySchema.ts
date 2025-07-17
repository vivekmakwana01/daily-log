import { z } from 'zod'

export const LogEntryCreateInput = z.object({
  note: z.string().min(1),
  date: z.string().datetime(),
  tags: z.array(z.string()).optional(),
  links: z.array(z.string().url()).optional()
})

export const LogEntryUpdateInput = z.object({
  status: z.enum(['active', 'deleted'])
})

export const LogEntryQuery = z.object({
  status: z.enum(['active', 'deleted']).optional()
})

export type LogEntryCreateInputType = z.infer<typeof LogEntryCreateInput>
export type LogEntryUpdateInputType = z.infer<typeof LogEntryUpdateInput>
export type LogEntryQueryType = z.infer<typeof LogEntryQuery>
