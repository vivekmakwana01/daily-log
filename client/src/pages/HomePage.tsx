import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DailyLogForm } from '@/components/DailyLogForm'
import { LogCard } from '@/components/LogCard'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Sidebar } from '@/components/Sidebar'
import { LogEntry } from 'shared'
import { useState, useMemo } from 'react'
import { isSameDay, isThisWeek } from 'date-fns'

export default function HomePage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [period, setPeriod] = useState<'all' | 'today' | 'week'>('all')
  const [tagMatchMode, setTagMatchMode] = useState<'any' | 'all'>('any')

  const { data: logs = [], isLoading } = useQuery<LogEntry[]>({
    queryKey: ['logs'],
    queryFn: async () => {
      const res = await fetch('/api/logs')
      return res.json()
    }
  })

  const addLog = useMutation({
    mutationFn: async (log: Partial<LogEntry>) => {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      })
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['logs'] })
  })

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        search.trim() === '' ||
        log.note.toLowerCase().includes(search.toLowerCase())

      const matchesTags =
        selectedTags.length === 0 ||
        (tagMatchMode === 'any'
          ? selectedTags.some((tag) => log.tags.includes(tag))
          : selectedTags.every((tag) => log.tags.includes(tag)))

      const logDate = new Date(log.date)
      const matchesPeriod =
        period === 'all' ||
        (period === 'today' && isSameDay(logDate, new Date())) ||
        (period === 'week' && isThisWeek(logDate))

      return matchesSearch && matchesTags && matchesPeriod
    })
  }, [logs, search, selectedTags, period, tagMatchMode])

  return (
    <main className="min-h-screen container mx-auto bg-background text-foreground flex">
      <aside className="w-96 border-r border-muted px-4 py-6 overflow-y-auto">
        <Sidebar
          allLogs={logs}
          search={search}
          setSearch={setSearch}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          period={period}
          setPeriod={setPeriod}
          filteredCount={filteredLogs.length}
          tagMatchMode={tagMatchMode}
          setTagMatchMode={setTagMatchMode}
        />
      </aside>

      <section className="flex-grow px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Daily Work Log</h1>
          <ThemeToggle />
        </div>

        <DailyLogForm onSubmit={addLog.mutate} existingLogs={logs ?? []} />

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : filteredLogs.length > 0 ? (
            filteredLogs.map((log) => <LogCard key={log.id} log={log} />)
          ) : (
            <p>No logs found for current filters.</p>
          )}
        </div>
      </section>
    </main>
  )
}
