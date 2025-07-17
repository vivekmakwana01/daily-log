import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TagSelector } from './TagSelector'
import { LogEntry } from 'shared'

const logSchema = z.object({
  note: z.string().min(1),
  links: z.string().optional(),
  date: z.date()
})

export function DailyLogForm({ onSubmit }: { onSubmit: (data: any) => void; existingLogs: LogEntry[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [tags, setTags] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(logSchema),
    defaultValues: { note: '', links: '', date: new Date() }
  })

  const submit = (data: any) => {
    onSubmit({
      note: data.note,
      tags,
      links: data.links
        ?.split(',')
        .map((l: string) => l.trim())
        .filter((l: string) => l.length > 0),
      date: date?.toISOString()
    })
    reset()
    setTags([])
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Textarea placeholder="What did you work on today?" {...register('note')} />
      {errors.note && <p className="text-red-500 text-sm">Note is required.</p>}

      <TagSelector tags={tags} setTags={setTags} />
      <Input placeholder="Links (comma-separated)" {...register('links')} />

      <div className="flex flex-col items-start space-y-2">
        <label className="text-sm font-medium">Log Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit">+ Add Log</Button>
    </form>
  )
}
