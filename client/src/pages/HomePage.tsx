import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DailyLogForm } from '@/components/DailyLogForm'
import { LogCard } from '@/components/LogCard'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LogEntry } from 'shared'

export default function HomePage() {
  const queryClient = useQueryClient()

  const { data: logs, isLoading } = useQuery<LogEntry[]>({
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

  return (
    <main className="min-h-screen bg-background text-foreground p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daily Work Log</h1>
        <ThemeToggle />
      </div>

      <DailyLogForm onSubmit={addLog.mutate} existingLogs={[]} />

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          logs?.map((log) => <LogCard key={log.id} log={log} />)
        )}
      </div>
    </main>
  )
}

// Other components (DailyLogForm.tsx, LogCard.tsx, ThemeToggle.tsx) will be added next
