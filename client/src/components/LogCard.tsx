import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogEntry } from 'shared'
import { format } from 'date-fns'

export function LogCard({ log }: { log: LogEntry }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex justify-between">
          <span>{format(new Date(log.date), 'PPP')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 whitespace-pre-wrap">{log.note}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {log.tags.map((tag) => (
            <Badge key={tag} variant="secondary">#{tag}</Badge>
          ))}
        </div>
        <div className="space-y-1">
          {log.links.map((link) => (
            <a
              key={link}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline break-all"
            >
              {link}
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
