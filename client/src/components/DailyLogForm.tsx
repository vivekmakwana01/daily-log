import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const logSchema = z.object({
  note: z.string().min(1),
  tags: z.string().optional(),
  links: z.string().optional(),
  date: z.date()
})

export function DailyLogForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(logSchema),
    defaultValues: { note: '', tags: '', links: '', date: new Date() }
  })

  const submit = (data: any) => {
    onSubmit({
      note: data.note,
      tags: data.tags?.split(',').map((t: string) => t.trim()),
      links: data.links?.split(',').map((l: string) => l.trim()),
      date: date?.toISOString()
    })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Textarea placeholder="What did you work on today?" {...register('note')} />
      {errors.note && <p className="text-red-500 text-sm">Note is required.</p>}

      <Input placeholder="#tags, comma-separated" {...register('tags')} />
      <Input placeholder="Links (comma-separated)" {...register('links')} />

      <div className="flex flex-col items-start space-y-2">
        <label className="text-sm font-medium">Log Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit">+ Add Log</Button>
    </form>
  )
}