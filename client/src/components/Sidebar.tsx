import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { LogEntry } from "shared"
import { Search, Calendar, Tag, BarChart } from "lucide-react"

interface SidebarProps {
  allLogs: LogEntry[]
  search: string
  setSearch: (value: string) => void
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  period: 'all' | 'today' | 'week'
  setPeriod: (p: 'all' | 'today' | 'week') => void
  filteredCount: number
  tagMatchMode: 'any' | 'all'
  setTagMatchMode: (mode: 'any' | 'all') => void
}

export function Sidebar({
  allLogs,
  search,
  setSearch,
  selectedTags,
  setSelectedTags,
  period,
  setPeriod,
  filteredCount,
  tagMatchMode,
  setTagMatchMode
}: SidebarProps) {
  const allTags = Array.from(new Set(allLogs.flatMap((log) => log.tags)))

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <div className="space-y-6 text-sm">
      <div className="bg-card p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2 font-semibold">
          <Search className="w-4 h-4" />
          Search
        </div>
        <Input
          placeholder="Search entries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-card p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2 font-semibold">
          <BarChart className="w-4 h-4" />
          Statistics
        </div>
        <div className="space-y-1 text-muted-foreground">
          <div>Total Logs: {allLogs.length}</div>
          <div>Showing: {filteredCount}</div>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2 font-semibold">
          <Calendar className="w-4 h-4" />
          Time Period
        </div>
        <div className="space-y-1">
          {['all', 'today', 'week'].map((val) => (
            <button
              key={val}
              onClick={() => setPeriod(val as any)}
              className={`w-full text-left px-3 py-1.5 rounded-md transition ${
                period === val
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {val === 'all' ? 'All Time' : val === 'today' ? 'Today' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2 font-semibold">
          <Tag className="w-4 h-4" />
          Filter by Tags
        </div>

        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Match all tags</span>
          <Switch
            checked={tagMatchMode === 'all'}
            onCheckedChange={(val) => setTagMatchMode(val ? 'all' : 'any')}
          />
        </div>

        <div className="space-y-2">
          {allTags.map((tag) => (
            <label key={tag} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              <span className={`text-xs font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground`}>
                #{tag}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
