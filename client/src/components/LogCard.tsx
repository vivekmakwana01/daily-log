import { LogEntry } from 'shared'

interface LogCardProps {
  log: LogEntry
  onDelete?: () => void
}

export function LogCard({ log, onDelete }: LogCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-card text-card-foreground">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date(log.date).toLocaleDateString()}
          </p>
          <p className="mt-1 whitespace-pre-line">{log.note}</p>

          {log.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {log.tags.map((tag) => (
                <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {log.links.length > 0 && (
            <div className="mt-2 space-y-1 text-sm">
              {log.links.map((link, i) => (
                <a
                  key={i}
                  href={link}
                  className="text-blue-500 hover:underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link}
                </a>
              ))}
            </div>
          )}
        </div>

        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 text-xs hover:underline ml-4"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
