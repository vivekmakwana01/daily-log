import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "use-debounce"

interface TagSelectorProps {
  tags: string[]
  setTags: (tags: string[]) => void
}

export function TagSelector({ tags, setTags }: TagSelectorProps) {
  const [input, setInput] = useState("")
  const [debouncedInput] = useDebounce(input, 300)

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setInput("")
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const { data: suggestions = [] } = useQuery<string[]>({
    queryKey: ["tags", debouncedInput],
    queryFn: async () => {
      const res = await fetch(`/api/tags?search=${debouncedInput}`)
      return res.json()
    },
    enabled: debouncedInput.length > 0,
  })

  const filteredSuggestions = suggestions.filter((s) => !tags.includes(s)).slice(0, 5)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(input)
    }
  }

  return (
    <div>
      <label className="text-sm font-medium">Tags</label>
      <div className="flex flex-wrap gap-2 my-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-red-500"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        placeholder="Type to add a tag"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {filteredSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="hover:text-primary underline"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
